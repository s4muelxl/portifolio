# Samuel Alves — Portfólio de Engenharia de Software

Portfólio publicado em **https://www.s4muelxl.com**, com página inicial e estudos de caso dos projetos NEXO, Cabeça de Gelo, BMI9, SaberX e Gerador de Recibos.

## Estrutura ativa

- `index.html`: apresentação, projetos, competências, 15 cursos/certificações, formação e contato.
- `projetos.html`: contexto, decisões técnicas, implementação e validação dos cinco projetos.
- `styles/`: tokens, fundamentos, componentes e apresentação em arquivos legíveis; a ordem da cascata é explícita em `scripts/build-css.mjs`.
- `portfolio.bundle.css`: folha gerada e publicada nas duas páginas. Não editar diretamente; execute `npm run build:css` após alterar `styles/`.
- `portfolio.js`: entrada das interações; inicializa cada responsabilidade separadamente.
- `portfolio-premium.js`: entrada independente dos aprimoramentos visuais.
- `interactions/`: módulos de navegação, foco, galerias/lightbox, contato, posição de leitura, prefetch, revelação e formações no mobile.
- `assets/fonts/`: fontes variáveis locais Manrope e Fira Code em WOFF2, com licenças e nomes identificados por hash.
- `data/gallery-data.mjs`: arquivos e legendas das galerias, compartilhados pelas duas páginas.
- `data/projects.mjs`: metadados, decisões de engenharia, fontes e diagramas simplificados dos cinco projetos.
- `components/receipt-demo.html`: componente estático compartilhado da demonstração.
- `receipt-core.mjs`: validação de valores, cálculo em centavos e exportação UTF-8; não acessa DOM nem rede.
- `receipt-demo.mjs`: interação da demonstração no navegador, com renderização por `textContent` e download local.
- `receipt-loader.mjs`: entrada isolada da demonstração; falhas não bloqueiam o menu.
- `assets/gallery/`: 27 screenshots reais já utilizados pelo portfólio.
- `assets/bmi9/`: imagens de obras do cliente, provenientes do repositório BMI9, otimizadas e servidas localmente. São contexto do cliente, não capturas da interface.
- `assets/Curriculo_Samuel_Alves_20261025.pdf`: currículo de uma página utilizado nos links atuais; URLs anteriores permanecem compatíveis.
- `vercel.json`: redirecionamentos, cache e cabeçalhos de segurança.

As folhas antigas `portfolio.css`, `portfolio-experience.css`, `portfolio-premium.css` e arquivos com sufixos `v2` a `v8` não são carregados pelas páginas atuais. São mantidas para compatibilidade e referência histórica.

## Experiência e acessibilidade

- Identidade monocromática e conteúdo profissional original preservado.
- Cabeçalho desktop e menu para larguras até 1080px, com um único controle abrir/fechar, Escape, foco contido e restauração de foco.
- Títulos e links para chegar diretamente a cada estudo de caso.
- NEXO e Cabeça de Gelo identificam código privado; não direcionam visitantes a arquivos inacessíveis.
- Galerias por botões, setas do teclado e gesto horizontal; imagens ampliadas permitem continuar navegando.
- Sobreposição de imagem isola o conteúdo de fundo e devolve o foco ao controle de origem.
- Leitura de seção e progresso atualizados no máximo uma vez por frame.
- A geometria inicial do menu usa a capacidade CSS `scripting`, evitando depender da chegada de um módulo para definir a altura do cabeçalho. Com JavaScript desativado, os links continuam visíveis na navegação estática; navegadores antigos recebem essa apresentação estática.
- Screenshots carregados sob demanda; vizinhos pré-carregados quando a galeria se aproxima da tela, respeitando economia de dados.
- Skip link, estados de foco e preferência por movimento reduzido. O conteúdo continua disponível sem JavaScript.
- Um único efeito de entrada de 240 ms; mudança para movimento reduzido revela todo o conteúdo pendente. O fundo não acompanha o cursor e as galerias não usam parallax de rolagem.
- Layouts com dimensões reservadas para imagens e fallback para fontes do sistema.
- Fontes hospedadas no próprio site, com subconjuntos latinos e preload. Fira Code usa carregamento opcional para evitar troca tardia em conexões lentas. Não há requisições de fontes a serviços externos.
- Links canônicos e Open Graph mantidos em `www.s4muelxl.com`.
- Monograma vetorial SA e apresentações distintas: celular para NEXO, janela desktop para Cabeça de Gelo e contexto de cliente para BMI9.
- Áreas expansíveis com decisões técnicas e três diagramas de arquitetura, disponíveis mesmo sem JavaScript.
- Transições nativas entre documentos nos navegadores que oferecem suporte; links e histórico seguem o comportamento normal.
- A demonstração adapta a lógica do projeto Python para JavaScript: aceita quantidades fracionadas, preços com vírgula ou ponto, até 12 itens e download `.txt`. Valores inválidos bloqueiam a exportação.

## Testes e manutenção

```bash
node --test tests/*.test.mjs
node scripts/sync-projects.mjs --check
python3 scripts/check-site.py
npm ci --ignore-scripts
npm run check:css
npm run typecheck
```

Os testes cobrem formatos monetários, limites, quantidades fracionadas, arredondamento, exportação UTF-8, galeria, integridade dos diagramas e ausência de links públicos para os dois repositórios privados. A verificação estática valida conteúdo essencial, recursos e âncoras e mantém um orçamento de 110 kB para CSS e JavaScript locais, incluindo os módulos de interação.

Para alterar a demonstração ou os painéis técnicos, edite os componentes/dados e execute:

```bash
node scripts/sync-projects.mjs
```

O workflow `Portfolio checks` executa essas verificações em pushes e pull requests. Ele não utiliza segredos nem interfere na publicação pela Vercel.
O runner é Ubuntu 24.04, fixado para evitar mudanças implícitas de sistema operacional nas comparações. Revisões antigas do mesmo PR são canceladas quando usam o grupo de concorrência do workflow.

## Verificação de 25/10/2026

- 13 testes automatizados, conteúdo essencial, cinco projetos, 15 cursos/certificações e 27 capturas.
- A matriz do CI inclui 320, 390, 768, 1024, 1080, 1081, 1440, 1920 e 2560px, mais smoke tests WebKit e Instagram simulado. Consulte o resultado do workflow para confirmar a execução de cada revisão.
- `scripts/browser-behavior.mjs` cobre teclado e foco no menu/lightbox, mudança de movimento reduzido em execução, recibo fracionado e falha de rede/markup da demonstração, em Chromium e WebKit.
- `scripts/navigation-stability.mjs` testa a altura do cabeçalho antes/depois da chegada do módulo, links sem JavaScript, foco ao cruzar o breakpoint e retorno do foco após download, em Chromium/WebKit.
- Os testes de navegador também cobrem erro de imagem no lightbox, modo inicial inválido, economia de dados e ausência de requisições ao Google Fonts.
- CSS/JavaScript locais: aproximadamente 108 kB de fonte publicada. A folha consolidada substitui três requisições CSS por uma, preservando a ordem da cascata. Execute `scripts/check-site.py` para o inventário exato e gzip estimado.
- O núcleo de recibos possui contratos JSDoc verificados com TypeScript estrito: `npx --yes --package typescript@5.9.3 tsc --project tsconfig.check.json`. Essa verificação cobre o núcleo, não todos os módulos DOM.
- Assets exigem revalidação. O currículo também usa uma nova URL para não depender da expiração de caches imutáveis anteriores.

O currículo pode ser reconstruído com Python, ReportLab e DejaVu Sans:

```bash
python3 scripts/build-resume.py
```

O script atualiza a versão datada e os dois nomes anteriores. Revise renderização, texto extraível e paginação antes de publicar.

## Desenvolvimento

O site publicado é estático e já contém o CSS gerado. Não precisa instalar dependências para servir localmente:

```bash
python3 -m http.server 8000
```

As alterações são publicadas pela integração Git do projeto **samuelalves** na Vercel. O repositório e os domínios existentes são preservados.

Para editar estilos, use as dependências de desenvolvimento com versões fixadas em `package-lock.json` e execute `npm run build:css`. O CI verifica o arquivo gerado; a Vercel apenas serve os arquivos estáticos.

O CI também gera relatórios em `artifacts/audit/`: axe nas duas páginas, menus e lightboxes em Chromium/WebKit, análise desktop, reflow e skip link; Lighthouse mobile simulado em servidor local com gzip para texto. Os resultados ficam no artefato do workflow. Ausência de violações automatizadas não certifica conformidade WCAG completa. Lighthouse de navegação não mede INP de usuários reais. Resultados do servidor anterior sem compressão não são diretamente comparáveis com os atuais.

O registro `CONTINUAR_PORTFOLIO.md` contém o estado do trabalho, pendências e uma mensagem para continuar no chat normal caso os créditos acabem. Ele não é incluído no deploy público.

## Validação

Antes de publicar, verificar as duas páginas em desktop e nas larguras 320, 390, 480, 768 e 1024px, incluindo navegação por teclado, menu, galerias, troca desktop/mobile, ampliação, fechamento e links internos. Conferir a preservação dos textos, cinco projetos, 15 certificações, 27 screenshots e do PDF do currículo. Verificar a sintaxe de `portfolio.js` com `node --check portfolio.js`.
