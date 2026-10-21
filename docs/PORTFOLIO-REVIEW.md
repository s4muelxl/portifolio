# Revisão — 21/10/2026

## Base e escopo

Evolução do repositório existente, baseline `54b0f3eef5bf8bc7d02519678e2ae38c1e486ca5`. Preservados projeto Vercel `samuelalves`, domínio e currículo existente. Sem alteração nos aplicativos apresentados.

## Problemas encontrados

- Destaques vazios sem JavaScript e dependentes de GitHub REST no navegador; ordenação por stars.
- Projetos fictícios na página antiga e em dicionários de tradução.
- Sitemap com domínio diferente do domínio de produção.
- Fontes externas, estilos inline e CSP com `unsafe-inline`.
- Menu fechava sem atualizar consistentemente `aria-expanded`.
- Assets sem fingerprint com cache immutable de um ano.
- Diretório de referências/skills com dependências e documentos na árvore do site estático.

## Mudanças

- Curadoria versionada, HTML estático e cinco estudos de caso, quatro destaques alternados.
- Snapshot público opcional do GitHub, sem tokens, sem dependência em runtime; atualização manual por script.
- Dark refinado, layouts fluidos, tipografia do sistema sem requisições externas, foco visível, reduced motion.
- Capturas reais das telas públicas; nenhuma imagem gerada apresentada como screenshot de produto.
- Download e abertura direta do PDF existente; não alterado o conteúdo do currículo.
- Canonical para o destino real www; sitemap, OG, Twitter, favicon, Person/CreativeWork.
- CSP sem unsafe-inline, hashes para JSON-LD, frame-ancestors, nosniff, políticas e HSTS.
- Build com allowlist: código de build, referências, documentação antiga e dados editoriais não são publicados.
- Rotas antigas preservadas como redirects; dicionários e script de tradução sem referências foram removidos porque continham conteúdo fictício. Outros documentos antigos foram preservados por cautela.

## Evidências editoriais

- NEXO: README, ARCHITECTURE, package.json, serviço offline-sync e configuração do roteador de IA; árvore main `fe490faf5a9625f76034777b5289f312bbf83b9e`.
- Cabeça de Gelo: README, package.json, RTC_ARCHITECTURE e configuração de simulcast/Opus; árvore main `444c74f89167f2c887e6f4c652bcc45cb70b3ab7`.
- SaberX: README, package.json, cálculos de domínio e políticas RLS.
- BMI9: README e backend Flask (PDF, validação, Resend/SMTP, Redis).
- Receipt Generator: README e implementação Python.
- FinanceCalc: README; explicitamente apresentado como estudo.
- Competências e cursos: PDF já versionado no portfólio. Não atribuímos cargos, senioridade, métricas ou certificações novas.

## Verificações locais

- Build sem dependências e `npm run check`: 12 HTMLs, 161 referências internas, âncoras, assets, alt/dimensões, JSON-LD, hashes CSP, assinatura PDF e limites CSS/JS.
- Chromium 133 / Playwright: 7 páginas em 9 larguras (320, 375, 390, 430, 768, 1024, 1440, 1920 e 2560).
- Sem overflow horizontal nos 63 cenários.
- Menu abre/fecha, atualiza aria-expanded e fecha por Escape; certificações expansíveis; navegação sem JS.
- Zero pageerrors e zero respostas >=400 durante a navegação local.
- axe-core 4.10.3: zero violações WCAG 2 A/AA e 2.1 AA detectadas nesses cenários. Testes automáticos não substituem revisão com leitor de tela.
- Todas as quatro imagens dos projetos decodificadas em desktop/mobile; PDF com HTTP 200 e assinatura válida.
- Lighthouse 12.8.2 local (simulação mobile): Performance 100, Acessibilidade 100, Boas práticas 100 e SEO 100 na execução válida. A primeira execução falhou em NO_SCREENSHOTS; a segunda concluiu. São resultados locais, não medições de produção.
- Aplicações NEXO, CBCdegelo, SaberX e BMI9 abertas em navegador remoto; captura pública registrada.

## Limitações

- Não houve teste em aparelho iPhone/Android físico nem Safari/WebKit real. Viewports móveis foram simulados no Chromium.
- Não houve login nos aplicativos nem auditoria funcional dos produtos apresentados. As capturas NEXO/SaberX são das telas de entrada.
- Headers/redirecionamentos da Vercel e deploy precisam ser verificados em produção após publicação.
- Sem afirmações de latência, capacidade, segurança absoluta ou ganhos quantitativos.
