/**
 * POST /api/vagas-candidatura
 * Recebe a candidatura da página /vagas e, em ordem:
 *   1. grava no Supabase (fonte da verdade)
 *   2. envia e-mail para o RH (Resend)
 *   3. publica no Slack (mensagem + currículo)
 *
 * Nenhuma etapa individual quebra a experiência do candidato: enquanto ao menos
 * um destino registrar a candidatura, a resposta ao usuário é de sucesso e
 * sempre amigável (o erro técnico fica apenas no log do servidor).
 *
 * Env (Infisical /shared → deploy):
 *   SLACK_BOT_TOKEN
 *   SLACK_VAGAS_CHANNEL_ID  (default: C0BJR82HBL5 = #vaga-dev privado)
 *   SUPABASE_URL            (default: projeto AdzHub)
 *   SUPABASE_ANON_KEY       (chave pública anon; RLS permite insert público)
 *   RESEND_API_KEY          (opcional — e-mail liga sozinho quando presente)
 *   RESEND_FROM             (default: AdzHub Vagas <onboarding@resend.dev>)
 *   RESEND_TO               (default: adm@spotmidiadigital.com.br)
 */

const CHANNEL_ID = process.env.SLACK_VAGAS_CHANNEL_ID || "C0BJR82HBL5";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://xciubsogktecqcgafwaa.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXVic29na3RlY3FjZ2Fmd2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjMyMzAsImV4cCI6MjA3MDMzOTIzMH0.0TTqMujpYz86Y911ykpgqO1VhyNcQ1UhbtTd3gwWyn0";
const RESEND_FROM = process.env.RESEND_FROM || "AdzHub Vagas <onboarding@resend.dev>";
const RESEND_TO = process.env.RESEND_TO || "adm@spotmidiadigital.com.br";

const MAX_PDF_BYTES = 3 * 1024 * 1024;
const MAX_BODY_BYTES = 4.4 * 1024 * 1024;

const SUCCESS_MESSAGE =
  "Candidatura enviada com sucesso! Nosso time vai analisar seu perfil e retornar pelo WhatsApp ou e-mail.";
const FRIENDLY_ERROR =
  "Não conseguimos concluir o envio agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp.";
const VALIDATION_MESSAGES = {
  invalid_json: "Não entendemos os dados enviados. Recarregue a página e tente de novo.",
  invalid_full_name: "Informe seu nome e sobrenome.",
  invalid_brazil_phone: "Informe um WhatsApp brasileiro válido, com DDD.",
  invalid_ibge_city: "Selecione sua cidade na lista de municípios.",
  pdf_too_large: "O currículo em PDF precisa ter no máximo 3 MB.",
  invalid_pdf_signature: "O arquivo enviado não é um PDF válido.",
  invalid_pdf: "Não foi possível ler o PDF enviado. Tente outro arquivo.",
  lgpd_required: "É necessário autorizar o uso dos dados (LGPD) para continuar.",
};

const REQUIRED = ["nome", "whatsapp", "cidade", "nivel", "disponibilidade", "ia"];

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

/** Erro de validação → resposta amigável 400 (sem vazar detalhe técnico). */
function fail(res, code) {
  return json(res, 400, {
    ok: false,
    message: VALIDATION_MESSAGES[code] || FRIENDLY_ERROR,
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("body_too_large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function slackApi(method, token, body, { form = false } = {}) {
  const resp = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": form
        ? "application/x-www-form-urlencoded; charset=utf-8"
        : "application/json; charset=utf-8",
    },
    body: form
      ? new URLSearchParams(
          Object.fromEntries(
            Object.entries(body).map(([key, value]) => [key, String(value)]),
          ),
        ).toString()
      : JSON.stringify(body),
  });
  return resp.json();
}

function fieldRows(data) {
  return [
    ["Nome", data.nome],
    ["WhatsApp", data.whatsapp],
    ["Cidade", data.cidade],
    ["Nível", data.nivel],
    ["Disponibilidade BH", data.disponibilidade],
    ["Pretensão", data.pretensao || "—"],
    ["LinkedIn", data.linkedin || "—"],
    ["GitHub / portfólio", data.github || "—"],
    ["Currículo", data.curriculoNome || "não anexado"],
  ];
}

function buildBlocks(data) {
  const rows = fieldRows(data);
  return [
    {
      type: "header",
      text: { type: "plain_text", text: "Nova candidatura · Núcleo Fundacional", emoji: true },
    },
    {
      type: "section",
      fields: rows.slice(0, 9).map(([label, value]) => ({
        type: "mrkdwn",
        text: `*${label}*\n${String(value).slice(0, 200)}`,
      })),
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Como usa IA no desenvolvimento*\n${String(data.ia).slice(0, 2800)}`,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `LGPD: ${data.lgpd ? "autorizado" : "não marcado"} · via adzhub.com.br/vagas`,
        },
      ],
    },
  ];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(data) {
  const rows = fieldRows(data)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#6B7280;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
          label,
        )}</td><td style="padding:6px 12px;color:#08080C;font-size:14px">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto">
    <h2 style="color:#37489d;margin-bottom:4px">Nova candidatura · Núcleo Fundacional</h2>
    <p style="color:#6B7280;font-size:13px;margin-top:0">Recebida em adzhub.com.br/vagas</p>
    <table style="border-collapse:collapse;width:100%;background:#FAFAFA;border-radius:8px">${rows}</table>
    <h3 style="color:#08080C;margin-top:20px;font-size:15px">Como usa IA no desenvolvimento</h3>
    <p style="color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(data.ia)}</p>
    <p style="color:#9CA3AF;font-size:12px;margin-top:16px">LGPD: ${
      data.lgpd ? "autorizado" : "não marcado"
    }${data.curriculoNome ? " · Currículo anexado no Slack (#vaga-dev)" : ""}</p>
  </div>`;
}

async function uploadPdf({ token, channel, threadTs, filename, bytes }) {
  const start = await slackApi(
    "files.getUploadURLExternal",
    token,
    { filename, length: bytes.length },
    { form: true },
  );
  if (!start.ok) throw new Error(start.error || "files.getUploadURLExternal failed");

  const put = await fetch(start.upload_url, {
    method: "POST",
    headers: { "Content-Type": "application/pdf" },
    body: bytes,
  });
  if (!put.ok) throw new Error(`upload_url HTTP ${put.status}`);

  const complete = await slackApi("files.completeUploadExternal", token, {
    files: [{ id: start.file_id, title: filename }],
    channel_id: channel,
    thread_ts: threadTs,
    initial_comment: `Currículo · ${filename}`,
  });
  if (!complete.ok) throw new Error(complete.error || "files.completeUploadExternal failed");
}

/** 1. Persiste no Supabase via RPC SECURITY DEFINER (não depende de RLS de INSERT). */
async function saveToSupabase(data, extra) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_vaga_candidatura`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_nome: data.nome,
      p_whatsapp: data.whatsapp,
      p_cidade: data.cidade,
      p_cidade_ibge_id: extra.cidadeIbgeId ?? null,
      p_linkedin: data.linkedin || null,
      p_github: data.github || null,
      p_nivel: data.nivel,
      p_pretensao: data.pretensao || null,
      p_disponibilidade: data.disponibilidade,
      p_ia: data.ia,
      p_lgpd: data.lgpd,
      p_curriculo_nome: data.curriculoNome || null,
      p_slack_ts: extra.slackTs ?? null,
      p_user_agent: extra.userAgent || null,
    }),
  });
  if (!resp.ok) {
    throw new Error(`supabase HTTP ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  }
  const id = await resp.json();
  return id ?? null;
}

/** 2. Envia e-mail para o RH via Resend (opcional; só roda com RESEND_API_KEY). */
async function sendEmail(data) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true };

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [RESEND_TO],
      subject: `Nova candidatura · ${data.nome}`,
      html: buildEmailHtml(data),
    }),
  });
  if (!resp.ok) {
    throw new Error(`resend HTTP ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  }
  return { skipped: false };
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return json(res, 204, {});
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, message: FRIENDLY_ERROR });
  }

  let payload;
  try {
    const raw = await readBody(req);
    payload = JSON.parse(raw.toString("utf8") || "{}");
  } catch {
    return fail(res, "invalid_json");
  }

  for (const key of REQUIRED) {
    if (!String(payload[key] || "").trim()) return fail(res, "invalid_json");
  }
  if (!payload.lgpd) return fail(res, "lgpd_required");

  const fullNameParts = String(payload.nome)
    .trim()
    .split(/\s+/)
    .filter((part) => part.length >= 2);
  if (fullNameParts.length < 2) return fail(res, "invalid_full_name");

  const phoneDigits = String(payload.whatsapp).replace(/\D/g, "");
  if (phoneDigits.length !== 10 && phoneDigits.length !== 11) {
    return fail(res, "invalid_brazil_phone");
  }
  if (!Number.isInteger(Number(payload.cidadeIbgeId)) || Number(payload.cidadeIbgeId) <= 0) {
    return fail(res, "invalid_ibge_city");
  }

  let pdfBytes = null;
  let pdfName = null;
  if (payload.curriculoBase64) {
    try {
      const b64 = String(payload.curriculoBase64).replace(/^data:application\/pdf;base64,/, "");
      pdfBytes = Buffer.from(b64, "base64");
      pdfName = String(payload.curriculoNome || "curriculo.pdf").replace(
        /[^\w.\- ()áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/gi,
        "_",
      );
      if (!pdfName.toLowerCase().endsWith(".pdf")) pdfName += ".pdf";
      if (pdfBytes.length > MAX_PDF_BYTES) return fail(res, "pdf_too_large");
      if (pdfBytes.length < 5 || pdfBytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
        return fail(res, "invalid_pdf_signature");
      }
    } catch {
      return fail(res, "invalid_pdf");
    }
  }

  const data = {
    nome: String(payload.nome).trim(),
    whatsapp: String(payload.whatsapp).trim(),
    cidade: String(payload.cidade).trim(),
    linkedin: String(payload.linkedin || "").trim(),
    github: String(payload.github || "").trim(),
    nivel: String(payload.nivel).trim(),
    pretensao: String(payload.pretensao || "").trim(),
    disponibilidade: String(payload.disponibilidade).trim(),
    ia: String(payload.ia).trim(),
    lgpd: Boolean(payload.lgpd),
    curriculoNome: pdfName,
  };

  const token = process.env.SLACK_BOT_TOKEN;
  const results = { supabase: false, email: false, slack: false };

  // 3. Slack primeiro dá o thread_ts para anexar o PDF; o ts é gravado no Supabase.
  let slackTs = null;
  if (token) {
    try {
      const posted = await slackApi("chat.postMessage", token, {
        channel: CHANNEL_ID,
        text: `Nova candidatura: ${data.nome} · ${data.whatsapp}`,
        blocks: buildBlocks(data),
      });
      if (!posted.ok) throw new Error(posted.error || "slack_post_failed");
      slackTs = posted.ts;
      results.slack = true;

      if (pdfBytes && pdfName) {
        try {
          await uploadPdf({ token, channel: CHANNEL_ID, threadTs: slackTs, filename: pdfName, bytes: pdfBytes });
        } catch (e) {
          console.error("[vagas-candidatura] slack pdf:", e instanceof Error ? e.message : e);
        }
      }
    } catch (e) {
      console.error("[vagas-candidatura] slack:", e instanceof Error ? e.message : e);
    }
  } else {
    console.error("[vagas-candidatura] SLACK_BOT_TOKEN ausente");
  }

  // 1. Supabase (fonte da verdade).
  try {
    await saveToSupabase(data, {
      cidadeIbgeId: Number(payload.cidadeIbgeId),
      slackTs,
      userAgent: req.headers["user-agent"],
    });
    results.supabase = true;
  } catch (e) {
    console.error("[vagas-candidatura] supabase:", e instanceof Error ? e.message : e);
  }

  // 2. E-mail RH (Resend).
  try {
    const emailResult = await sendEmail(data);
    results.email = !emailResult.skipped;
    if (emailResult.skipped) console.warn("[vagas-candidatura] e-mail ignorado: RESEND_API_KEY ausente");
  } catch (e) {
    console.error("[vagas-candidatura] email:", e instanceof Error ? e.message : e);
  }

  const registered = results.supabase || results.slack || results.email;
  if (!registered) {
    return json(res, 502, { ok: false, message: FRIENDLY_ERROR });
  }

  return json(res, 200, { ok: true, message: SUCCESS_MESSAGE });
}
