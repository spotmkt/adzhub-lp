# Search Console e subdomínios (ex.: n8n.adzhub.com.br)

## Por que o Google indexou `n8n.adzhub.com.br`?

1. **Propriedade no Search Console** — Se a propriedade for do tipo **Domínio** (`adzhub.com.br`), o Google agrega URLs de **todos** os subdomínios (`www`, `n8n`, `app`, etc.), mesmo que o site principal não linke para eles.

2. **Descoberta** — O Google pode encontrar o subdomínio por DNS público, links externos, menções ou histórico de rastreamento.

3. **Este repositório (landing / app)** — O `sitemap.xml` gerado por `scripts/generate-sitemap.mjs` lista apenas URLs em `https://adzhub.com.br/...`. **Não** inclui `n8n.adzhub.com.br`.

## O que fazer se não quiser esse subdomínio na busca

- **No servidor do n8n** (ou reverse proxy): servir `robots.txt` com `Disallow: /` e/ou resposta `noindex` nas páginas, se fizer sentido para o seu caso de uso.
- **No Search Console**: usar **Remoção de URLs** temporária e, se aplicável, regras de remoção para prefixos.
- **Autenticação**: instâncias internas costumam ficar atrás de login — isso reduz indexação, mas não substitui `noindex`/`robots` quando o endpoint é público.

O favicon exibido ao abrir qualquer URL do domínio (incluindo `/sitemap.xml`) vem do **favicon configurado no deploy** (`/favicon.svg` ou equivalente em `public/`). Garanta que esses arquivos existam no build e não apontem para assets de terceiros.
