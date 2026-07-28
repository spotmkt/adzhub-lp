/**
 * POST /api/waitlist
 * Recebe a solicitação da lista de espera (LP) e publica no Slack.
 *
 * Env (Infisical /shared → deploy):
 *   SLACK_BOT_TOKEN
 *   SLACK_WAITLIST_CHANNEL_ID  (default: C08C9E8HMA5 = #0-adz-hub)
 */

const CHANNEL_ID = process.env.SLACK_WAITLIST_CHANNEL_ID || "C08C9E8HMA5";

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
    ["Site", data.site],
    ["Origem", data.pagePath || "/"],
  ];
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

  if (!nome || nome.split(/\s+/).filter((p) => p.length >= 2).length < 2) {
    return json(res, 400, { ok: false, message: "Informe seu nome e sobrenome." });
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
  if (!site || !site.includes(".")) {
    return json(res, 400, { ok: false, message: "Informe o site da empresa (ex.: empresa.com.br)." });
  }

  const data = {
    nome,
    email,
    telefone,
    perfil: ROLE_LABEL[role],
    site,
    pagePath,
  };

  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    console.error("[waitlist] SLACK_BOT_TOKEN ausente");
    return json(res, 502, { ok: false, message: FRIENDLY_ERROR });
  }

  try {
    const posted = await slackApi("chat.postMessage", token, {
      channel: CHANNEL_ID,
      text: `Nova lista de espera: ${data.nome} · ${data.email} · ${data.site}`,
      blocks: buildBlocks(data),
    });
    if (!posted.ok) throw new Error(posted.error || "slack_post_failed");
  } catch (e) {
    console.error("[waitlist] slack:", e instanceof Error ? e.message : e);
    return json(res, 502, { ok: false, message: FRIENDLY_ERROR });
  }

  return json(res, 200, { ok: true, message: SUCCESS_MESSAGE });
}
