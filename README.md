# Samuel Alves — Portfólio de Engenharia de Software

Portfólio publicado em **https://www.s4muelxl.com**, com página inicial e estudos de caso dos projetos NEXO, Cabeça de Gelo, BMI9, SaberX e Gerador de Recibos.

## Estrutura ativa

- `index.html`: apresentação, projetos, competências, 15 cursos/certificações, formação e contato.
- `projetos.html`: contexto, decisões técnicas, implementação e validação dos cinco projetos.
- `portfolio.css`: sistema visual compartilhado em preto, branco e cinza, com layouts responsivos e versão para impressão.
- `portfolio.js`: navegação, foco, leitura de seção, animações e galerias.
- `portfolio-experience.css`: apresentação específica de projetos, demonstração, arquitetura e transições entre páginas.
- `data/gallery-data.mjs`: arquivos e legendas das galerias, compartilhados pelas duas páginas.
- `data/projects.mjs`: metadados, decisões de engenharia, fontes e diagramas simplificados dos cinco projetos.
- `components/receipt-demo.html`: componente estático compartilhado da demonstração.
- `receipt-core.mjs`: validação de valores, cálculo em centavos e exportação UTF-8; não acessa DOM nem rede.
- `receipt-demo.mjs`: interação da demonstração no navegador, com renderização por `textContent` e download local.
- `assets/gallery/`: 27 screenshots reais já utilizados pelo portfólio.
- `assets/bmi9/`: imagens de obras do cliente, provenientes do repositório BMI9, otimizadas e servidas localmente. São contexto do cliente, não capturas da interface.
- `assets/Curriculo_Samuel_Alves.pdf`: currículo disponível para download.
- `vercel.json`: redirecionamentos, cache e cabeçalhos de segurança.

Arquivos com sufixos `v2` a `v8` são versões anteriores e não são carregados pelas páginas ativas.

## Experiência e acessibilidade

- Identidade monocromática e conteúdo profissional original preservado.
- Cabeçalho desktop e menu para larguras até 1080px, com um único controle abrir/fechar, Escape, foco contido e restauração de foco.
- Índices para chegar diretamente a cada projeto e estudo de caso.
- Galerias por botões, setas do teclado e gesto horizontal; imagens ampliadas permitem continuar navegando.
- Sobreposição de imagem isola o conteúdo de fundo e devolve o foco ao controle de origem.
- Leitura de seção e progresso atualizados no máximo uma vez por frame.
- Screenshots carregados sob demanda; vizinhos pré-carregados quando a galeria se aproxima da tela, respeitando economia de dados.
- Skip link, estados de foco e preferência por movimento reduzido. O conteúdo continua disponível sem JavaScript.
- Layouts com dimensões reservadas para imagens e fallback para fontes do sistema.
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

Os testes cobrem formatos monetários, limites, quantidades fracionadas, arredondamento, exportação UTF-8, galeria e integridade dos diagramas. A verificação estática preserva os textos da versão anterior, valida recursos e âncoras e mantém um orçamento de 110 kB para CSS e JavaScript locais.

Para alterar a demonstração ou os painéis técnicos, edite os componentes/dados e execute:

```bash
node scripts/sync-projects.mjs
```

O workflow `Portfolio checks` executa essas verificações em pushes e pull requests. Ele não utiliza segredos nem interfere na publicação pela Vercel.

## Verificação de 23/10/2026

- 10 testes automatizados aprovados; conteúdo original, cinco projetos, 15 cursos/certificações e 27 capturas mantidos.
- Testes de navegador: cálculo com quantidade fracionada, adição/remoção, entrada negativa bloqueada e conteúdo do download UTF-8.
- Layout das duas páginas conferido nas larguras 320, 390, 480, 768, 1024 e 1280px, além do menu e do visualizador de imagens.
- CSS/JavaScript locais: aproximadamente 79 kB de fonte e 20 kB em gzip estimado. Este inventário mede bytes, não latência, pontuação Lighthouse ou Core Web Vitals. Não há pontuação de desempenho publicada sem uma auditoria correspondente.

## Desenvolvimento

Projeto estático, sem instalação de dependências ou etapa de build. Para servir localmente:

```bash
python3 -m http.server 8000
```

As alterações são publicadas pela integração Git do projeto **samuelalves** na Vercel. O repositório e os domínios existentes são preservados.

## Validação

Antes de publicar, verificar as duas páginas em desktop e nas larguras 320, 390, 480, 768 e 1024px, incluindo navegação por teclado, menu, galerias, troca desktop/mobile, ampliação, fechamento e links internos. Conferir a preservação dos textos, cinco projetos, 15 certificações, 27 screenshots e do PDF do currículo. Verificar a sintaxe de `portfolio.js` com `node --check portfolio.js`.
