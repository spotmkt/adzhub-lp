# AdzHub — frontend

Monorepo de interface: landing pública (Vite + React), blog, contato e áreas logadas da plataforma.

## Requisitos

- Node.js 18+
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

O servidor de desenvolvimento sobe em `http://localhost:8080` (ver `vite.config.ts`).

## Build

```bash
npm run build
```

Gera o sitemap (`scripts/generate-sitemap.mjs`) e o bundle de produção em `dist/`.

## Variáveis de ambiente

Use `.env` / `.env.local` conforme a documentação do projeto (Supabase, URLs públicas, etc.).

### Edge Function `edit-image-ai` (Supabase)

Configure no painel do Supabase:

- `AI_IMAGE_API_KEY` — chave Bearer do provedor de IA
- `AI_IMAGE_GATEWAY_URL` — URL completa do endpoint de chat/completions compatível com o payload atual (ex.: provedor com API estilo OpenAI)

## Documentação adicional

- `docs/search-console-subdominios.md` — Search Console, subdomínios e sitemap

## Licença

Proprietário — AdzHub.
