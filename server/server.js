import "dotenv/config";
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const port = Number(process.env.PORT || 3001);
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 10_000) throw new Error("Request body too large");
  }
  return body ? JSON.parse(body) : {};
}

async function telegramSend(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    const error = new Error("Telegram n'est pas configuré. Définis TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID côté serveur.");
    error.statusCode = 503;
    throw error;
  }
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    const error = new Error("Telegram a refusé le message. Vérifie le token, le chat ID et que tu as démarré le bot.");
    error.statusCode = 502;
    throw error;
  }
  return true;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  try {
    if (req.method === "GET" && url.pathname === "/api/status") {
      return json(res, 200, {
        app: "Resaler Radar V3",
        telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
        marketplaceScanning: false,
        note: "Les recherches multi-sites sont disponibles, mais la collecte automatique des annonces n'est pas connectée."
      });
    }
    if (req.method === "POST" && url.pathname === "/api/telegram/test") {
      await readJson(req);
      await telegramSend("✅ Resaler Radar V3 : connexion Telegram testée avec succès. Les alertes d'opportunités seront envoyées après activation des sources de prix.");
      return json(res, 200, { ok: true, message: "Message de test envoyé sur Telegram." });
    }
    if (req.method === "POST" && url.pathname === "/api/telegram/notify") {
      const item = await readJson(req);
      const required = ["name", "buyPrice", "sellPrice", "netProfit", "sourceUrl"];
      if (required.some(key => item[key] === undefined || item[key] === null || item[key] === "")) {
        return json(res, 400, { ok: false, message: "Informations de l'opportunité incomplètes." });
      }
      const buy = Number(item.buyPrice), sell = Number(item.sellPrice), net = Number(item.netProfit);
      if (![buy, sell, net].every(Number.isFinite) || buy < 0 || sell < 0 || net < 3) {
        return json(res, 400, { ok: false, message: "L'alerte exige des prix valides et au moins 3 € nets estimés." });
      }
      if (typeof item.sourceUrl !== "string" || !/^https?:\/\//i.test(item.sourceUrl)) {
        return json(res, 400, { ok: false, message: "Lien source invalide." });
      }
      const safe = value => String(value).replace(/[<>]/g, "").slice(0, 160);
      const message = [
        "🎯 RESALER RADAR — OPPORTUNITÉ",
        `Produit : ${safe(item.name)}`,
        `Prix d'achat : ${buy.toFixed(2)} €`,
        `Prix de revente : ${sell.toFixed(2)} €`,
        `Bénéfice net estimé : +${net.toFixed(2)} €`,
        `Source : ${safe(item.source || "non précisée")}`,
        `Lien : ${item.sourceUrl}`,
        "⚠️ Vérifie la disponibilité, les frais et la comparabilité du produit avant d'acheter."
      ].join("\n");
      await telegramSend(message);
      return json(res, 200, { ok: true, message: "Alerte envoyée." });
    }

    const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const file = path.resolve(root, "." + requested);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, "index.html")) {
      return json(res, 403, { error: "Forbidden" });
    }
    let target = file;
    try { await stat(target); } catch {
      if (!path.extname(requested)) target = path.join(root, "index.html");
      else return json(res, 404, { error: "Not found" });
    }
    const data = await readFile(target);
    res.writeHead(200, { "Content-Type": mime[path.extname(target)] || "application/octet-stream", "X-Content-Type-Options": "nosniff" });
    return res.end(data);
  } catch (error) {
    return json(res, error.statusCode || 400, { ok: false, message: error.message || "Erreur serveur." });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Resaler Radar server listening on port ${port}`);
});
