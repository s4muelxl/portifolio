# Samuel Alves — Portfólio de Engenharia de Software

Portfólio publicado em **https://www.s4muelxl.com**, com página inicial e estudos de caso dos projetos NEXO, Cabeça de Gelo, BMI9, SaberX e Gerador de Recibos.

## Estrutura ativa

- `index.html`: apresentação, projetos, competências, 15 cursos/certificações, formação e contato.
- `projetos.html`: contexto, decisões técnicas, implementação e validação dos cinco projetos.
- `portfolio.css`: sistema visual compartilhado em preto, branco e cinza, com layouts responsivos e versão para impressão.
- `portfolio.js`: entrada das interações; inicializa cada responsabilidade separadamente.
- `portfolio-premium.js`: entrada independente dos aprimoramentos visuais.
- `interactions/`: módulos de navegação, foco, galerias/lightbox, contato, posição de leitura, prefetch, revelação e formações no mobile.
- `assets/fonts/`: fontes variáveis locais Manrope e Fira Code em WOFF2, com licenças e nomes identificados por hash.
- `portfolio-experience.css`: apresentação específica de projetos, demonstração, arquitetura e transições entre páginas.
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

Arquivos com sufixos `v2` a `v8` são versões anteriores e não são carregados pelas páginas ativas.

## Experiência e acessibilidade

- Identidade monocromática e conteúdo profissional original preservado.
- Cabeçalho desktop e menu para larguras até 1080px, com um único controle abrir/fechar, Escape, foco contido e restauração de foco.
- Títulos e links para chegar diretamente a cada estudo de caso.
- NEXO e Cabeça de Gelo identificam código privado; não direcionam visitantes a arquivos inacessíveis.
- Galerias por botões, setas do teclado e gesto horizontal; imagens ampliadas permitem continuar navegando.
- Sobreposição de imagem isola o conteúdo de fundo e devolve o foco ao controle de origem.
- Leitura de seção e progresso atualizados no máximo uma vez por frame.
- Screenshots carregados sob demanda; vizinhos pré-carregados quando a galeria se aproxima da tela, respeitando economia de dados.
- Skip link, estados de foco e preferência por movimento reduzido. O conteúdo continua disponível sem JavaScript.
- Um único efeito de entrada de 240 ms; mudança para movimento reduzido revela todo o conteúdo pendente. O fundo não acompanha o cursor e as galerias não usam parallax de rolagem.
- Layouts com dimensões reservadas para imagens e fallback para fontes do sistema.
- Fontes hospedadas no próprio site; o preload prioriza Manrope. Não há requisições de fontes a serviços externos.
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
```

Os testes cobrem formatos monetários, limites, quantidades fracionadas, arredondamento, exportação UTF-8, galeria, integridade dos diagramas e ausência de links públicos para os dois repositórios privados. A verificação estática valida conteúdo essencial, recursos e âncoras e mantém um orçamento de 110 kB para CSS e JavaScript locais, incluindo os módulos de interação.

Para alterar a demonstração ou os painéis técnicos, edite os componentes/dados e execute:

```bash
node scripts/sync-projects.mjs
```

O workflow `Portfolio checks` executa essas verificações em pushes e pull requests. Ele não utiliza segredos nem interfere na publicação pela Vercel.

## Verificação de 25/10/2026

- 13 testes automatizados, conteúdo essencial, cinco projetos, 15 cursos/certificações e 27 capturas.
- A matriz do CI inclui 320, 390, 768, 1024, 1080, 1081, 1440, 1920 e 2560px, mais smoke tests WebKit e Instagram simulado. Consulte o resultado do workflow para confirmar a execução de cada revisão.
- `scripts/browser-behavior.mjs` cobre teclado e foco no menu/lightbox, mudança de movimento reduzido em execução, recibo fracionado e falha de rede/markup da demonstração, em Chromium e WebKit.
- Os testes de navegador também cobrem erro de imagem no lightbox, modo inicial inválido, economia de dados e ausência de requisições ao Google Fonts.
- CSS/JavaScript locais: aproximadamente 109 kB de fonte. Execute `scripts/check-site.py` para o inventário exato e gzip estimado. Isto não mede latência ou Core Web Vitals.
- O núcleo de recibos possui contratos JSDoc verificados com TypeScript estrito: `npx --yes --package typescript@5.9.3 tsc --project tsconfig.check.json`. Essa verificação cobre o núcleo, não todos os módulos DOM.
- Assets exigem revalidação. O currículo também usa uma nova URL para não depender da expiração de caches imutáveis anteriores.

O currículo pode ser reconstruído com Python, ReportLab e DejaVu Sans:

```bash
python3 scripts/build-resume.py
```

O script atualiza a versão datada e os dois nomes anteriores. Revise renderização, texto extraível e paginação antes de publicar.

## Desenvolvimento

Projeto estático, sem instalação de dependências ou etapa de build. Para servir localmente:

```bash
python3 -m http.server 8000
```

As alterações são publicadas pela integração Git do projeto **samuelalves** na Vercel. O repositório e os domínios existentes são preservados.

O registro `CONTINUAR_PORTFOLIO.md` contém o estado do trabalho, pendências e uma mensagem para continuar no chat normal caso os créditos acabem. Ele não é incluído no deploy público.

## Validação

Antes de publicar, verificar as duas páginas em desktop e nas larguras 320, 390, 480, 768 e 1024px, incluindo navegação por teclado, menu, galerias, troca desktop/mobile, ampliação, fechamento e links internos. Conferir a preservação dos textos, cinco projetos, 15 certificações, 27 screenshots e do PDF do currículo. Verificar a sintaxe de `portfolio.js` com `node --check portfolio.js`.
