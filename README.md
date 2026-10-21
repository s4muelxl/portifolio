# Samuel Alves — Portfólio

Portfólio profissional em HTML, CSS e JavaScript, evoluído a partir do projeto existente. Produção: https://www.s4muelxl.com/ (o domínio raiz mantém seu redirecionamento atual).

## Conteúdo e build

- `data/projects.js`: fonte editorial dos projetos e estudos de caso.
- `data/github-public.json`: snapshot público complementar; não determina os destaques.
- `scripts/build.js`: gera HTML estático, sitemap e CSP com hashes do JSON-LD; monta `dist/` com allowlist de arquivos públicos.
- `style.css` / `script.js`: visual e menu com melhoria progressiva.
- `assets/projects/`: capturas reais das páginas públicas das aplicações.
- `projects/*/index.html`: estudos de caso gerados.

```sh
npm run refresh:github # opcional; mantém snapshot anterior em falha
npm run build
npm run check
python3 -m http.server 8080 --directory dist
```

Sem dependências de runtime/build. Os projetos continuam disponíveis sem JavaScript, sem rede externa e sem API do GitHub. Nenhum token é necessário. Depois de editar dados ou CSS/JS, execute o build e versione também os HTMLs e `vercel.json` gerados. Não editar os HTMLs gerados diretamente.

## Deploy existente

Vercel: `samuelalves`, projeto `prj_UgYPjUBvg53JgnqGzipNc6iTDxNt`, equipe `team_ZpAAm7QOBuAFX57BA28WCUfc`.
Repositório: `s4muelxl/portifolio`. Build: `npm run build`. Output: `dist`.
Não criar projeto, alterar DNS ou transferir domínio.

Os arquivos históricos e a pasta de referências `skill.md` foram preservados no Git, mas ficam fora do artefato público. As páginas antigas redirecionam para as seções correspondentes; os projetos fictícios foram removidos delas.

## Conteúdo e privacidade

NEXO e Cabeça de Gelo têm código privado. O portfólio publica apenas descrições autorizadas e capturas públicas, sem copiar código privado ou credenciais. As capturas de NEXO/SaberX mostram a tela de acesso, não dados pessoais. Conteúdo baseado no código e README inspecionados e no currículo já versionado; não representa auditoria ou certificação dos produtos.
