import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { pathToFileURL } from "url";

/** Proxy local de /api/vagas-candidatura → handler serverless (mesmo arquivo da Vercel). */
function vagasCandidaturaApi(): Plugin {
  return {
    name: "vagas-candidatura-api",
    configureServer(server) {
      // loadEnv não sobrescreve vars já exportadas no shell — forçamos o .env do projeto.
      const serverKeys = [
        "SLACK_BOT_TOKEN",
        "SLACK_VAGAS_CHANNEL_ID",
        "SUPABASE_URL",
        "SUPABASE_ANON_KEY",
        "RESEND_API_KEY",
        "RESEND_FROM",
        "RESEND_TO",
      ];
      for (const key of serverKeys) {
        delete process.env[key];
      }
      const env = loadEnv(server.config.mode, server.config.root, "");
      for (const key of serverKeys) {
        if (env[key]) process.env[key] = env[key];
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/vagas-candidatura")) return next();

        try {
          const mod = await import(
            pathToFileURL(path.resolve(__dirname, "api/vagas-candidatura.mjs")).href + `?t=${Date.now()}`
          );
          await mod.default(req, res);
        } catch (err) {
          console.error("[vagas-candidatura-api]", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: "local_api_failed" }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), vagasCandidaturaApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
