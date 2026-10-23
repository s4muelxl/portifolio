# Samuel Alves — Portfólio de Engenharia de Software

Portfólio publicado em **https://www.s4muelxl.com**, com página inicial e estudos de caso dos projetos NEXO, Cabeça de Gelo, BMI9, SaberX e Gerador de Recibos.

## Estrutura ativa

- `index.html`: apresentação, projetos, competências, 15 cursos/certificações, formação e contato.
- `projetos.html`: contexto, decisões técnicas, implementação e validação dos cinco projetos.
- `portfolio.css`: sistema visual compartilhado em preto, branco e cinza, com layouts responsivos e versão para impressão.
- `portfolio.js`: navegação, foco, leitura de seção, animações e galerias.
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

## Desenvolvimento

Projeto estático, sem instalação de dependências ou etapa de build. Para servir localmente:

```bash
python3 -m http.server 8000
```

As alterações são publicadas pela integração Git do projeto **samuelalves** na Vercel. O repositório e os domínios existentes são preservados.

## Validação

Antes de publicar, verificar as duas páginas em desktop e nas larguras 320, 390, 480, 768 e 1024px, incluindo navegação por teclado, menu, galerias, troca desktop/mobile, ampliação, fechamento e links internos. Conferir a preservação dos textos, cinco projetos, 15 certificações, 27 screenshots e do PDF do currículo. Verificar a sintaxe de `portfolio.js` com `node --check portfolio.js`.
