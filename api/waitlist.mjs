/**
 * POST /api/waitlist
 * Recebe a solicitação da lista de espera (LP) e, em ordem:
 *   1. grava no Supabase (fonte da verdade)
 *   2. publica no Slack
 *
 * Enquanto ao menos um destino registrar o lead, a resposta ao usuário é de sucesso.
 *
 * Env (Infisical /shared → deploy):
 *   SLACK_BOT_TOKEN
 *   SLACK_WAITLIST_CHANNEL_ID  (default: C08C9E8HMA5 = #0-adz-hub)
 *   SUPABASE_URL               (default: projeto AdzHub)
 *   SUPABASE_ANON_KEY          (chave pública anon; insert via RPC SECURITY DEFINER)
 */

const CHANNEL_ID = process.env.SLACK_WAITLIST_CHANNEL_ID || "C08C9E8HMA5";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://xciubsogktecqcgafwaa.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXVic29na3RlY3FjZ2Fmd2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjMyMzAsImV4cCI6MjA3MDMzOTIzMH0.0TTqMujpYz86Y911ykpgqO1VhyNcQ1UhbtTd3gwWyn0";

const ROLE_LABEL = {
  marketing: "Profissional de marketing",
  entrepreneur: "Empresário(a)",
};

const SUCCESS_MESSAGE =
  "Solicitação enviada! Nosso time vai analisar e retornar em breve pelo e-mail ou WhatsApp.";
const FRIENDLY_ERROR =
  "Não conseguimos concluir o envio agora. Tente novamente em instantes.";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 64 * 1024) {
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

async function slackApi(method, token, body) {
  const resp = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });
  return resp.json();
}

function normalizeSite(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "");
}

function buildBlocks(data) {
  const rows = [
    ["Nome", data.nome],
    ["E-mail", data.email],
    ["Telefone", data.telefone],
    ["Perfil", data.perfil],
  ];
  if (data.site && data.site !== "—") {
    rows.push(["Site", data.site]);
  }
  rows.push(["Origem", data.pagePath || "/"]);
  return [
    {
      type: "header",
      text: { type: "plain_text", text: "Nova solicitação · Lista de espera", emoji: true },
    },
    {
      type: "section",
      fields: rows.map(([label, value]) => ({
        type: "mrkdwn",
        text: `*${label}:*\n${value || "—"}`,
      })),
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Enviado em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`,
        },
      ],
    },
  ];
}

/** Persiste no Supabase via RPC SECURITY DEFINER (não depende de RLS de INSERT). */
async function saveToSupabase(data, extra) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_waitlist_lead`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_nome: data.nome,
      p_email: data.email,
      p_telefone: data.telefone,
      p_role: data.role,
      p_site: data.role === "entrepreneur" ? data.site : null,
      p_page_path: data.pagePath || null,
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

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return json(res, 204, {});
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, message: "Método não permitido." });
  }

  let payload;
  try {
    const raw = await readBody(req);
    payload = JSON.parse(raw.toString("utf8") || "{}");
  } catch {
    return json(res, 400, { ok: false, message: "Não entendemos os dados enviados." });
  }

  const nome = String(payload.nome || "").trim();
  const email = String(payload.email || "").trim();
  const telefone = String(payload.telefone || "").trim();
  const role = String(payload.role || "").trim();
  const site = normalizeSite(payload.site);
  const pagePath = String(payload.pagePath || "").trim().slice(0, 200);
  const userAgent = String(req.headers["user-agent"] || "").slice(0, 500);

  if (!nome) {
    return json(res, 400, { ok: false, message: "Informe seu nome." });
  }
  if (!email.includes("@")) {
    return json(res, 400, { ok: false, message: "Informe um e-mail válido." });
  }
  const digits = telefone.replace(/\D/g, "");
  if (digits.length < 10) {
    return json(res, 400, { ok: false, message: "Informe um telefone válido (com DDD)." });
  }
  if (!ROLE_LABEL[role]) {
    return json(res, 400, {
      ok: false,
      message: "Selecione se você é profissional de marketing ou empresário(a).",
    });
  }
  if (role === "entrepreneur" && (!site || !site.includes("."))) {
    return json(res, 400, { ok: false, message: "Informe o site da empresa (ex.: empresa.com.br)." });
  }

  const data = {
    nome,
    email,
    telefone,
    role,
    perfil: ROLE_LABEL[role],
    site: role === "entrepreneur" ? site : "—",
    pagePath,
  };

  const results = { supabase: false, slack: false };
  let slackTs = null;

  const token = process.env.SLACK_BOT_TOKEN;
  if (token) {
    try {
      const posted = await slackApi("chat.postMessage", token, {
        channel: CHANNEL_ID,
        text: `Nova lista de espera: ${data.nome} · ${data.email}${role === "entrepreneur" ? ` · ${site}` : ""}`,
        blocks: buildBlocks(data),
      });
      if (!posted.ok) throw new Error(posted.error || "slack_post_failed");
      slackTs = posted.ts || null;
      results.slack = true;
    } catch (e) {
      console.error("[waitlist] slack:", e instanceof Error ? e.message : e);
    }
  } else {
    console.error("[waitlist] SLACK_BOT_TOKEN ausente");
  }

  try {
    await saveToSupabase(data, { slackTs, userAgent });
    results.supabase = true;
  } catch (e) {
    console.error("[waitlist] supabase:", e instanceof Error ? e.message : e);
  }

  if (!results.supabase && !results.slack) {
    return json(res, 502, { ok: false, message: FRIENDLY_ERROR });
  }

  return json(res, 200, { ok: true, message: SUCCESS_MESSAGE });
}
