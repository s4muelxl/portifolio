# Samuel Alves — Portfólio de Engenharia de Software

Portfólio profissional de **Samuel Alves**, estudante de Engenharia de Software, publicado em **https://www.s4muelxl.com**.

O projeto apresenta uma seleção editorial de trabalhos reais em desenvolvimento de software, produtos web, PWA, comunicação em tempo real, automação e dados — sem gerar cards fictícios ou depender da API do GitHub no navegador.

## Destaques

- **NEXO** — PWA/mobile-first para treino, rotina, finanças, investimentos e inteligência contextual.
- **Cabeça de Gelo** — plataforma privada de comunicação com WebRTC, LiveKit e compartilhamento de tela.
- **SaberX** — sistema de cotações, compras e vendas com React, TypeScript, Supabase e PostgreSQL.
- **BMI9** — plataforma institucional com geração de propostas, captação de leads e backend serverless.
- **Receipt Generator** — automação CLI em Python para criação de recibos padronizados.

## Estrutura

```text
portifolio/
├── index.html              # Página principal
├── projetos.html           # Estudos de caso
├── 404.html                # Estado de rota inexistente
├── style.css               # Design system/base histórica
├── portfolio-v2.css        # Camada visual atual
├── script.js               # Navegação, scrollspy e filtros
├── assets/                 # Foto, currículo e recursos
├── robots.txt              # Regras para crawlers
├── sitemap.xml             # URLs canônicas
└── vercel.json             # Headers, cache e redirects
```

## Stack do portfólio

O próprio portfólio é propositalmente leve:

- HTML5 semântico
- CSS3 responsivo
- JavaScript vanilla
- Vercel
- GitHub

Não há framework no cliente nem chamada runtime à API do GitHub para renderizar os projetos principais.

## Qualidade

A implementação atual inclui:

- navegação por teclado e link de salto para o conteúdo;
- estados de foco visíveis e suporte a `prefers-reduced-motion`;
- layout responsivo para desktop, tablet e mobile;
- metadados SEO, canonical e Open Graph;
- sitemap e robots apontando para `s4muelxl.com`;
- Content Security Policy e headers de segurança na Vercel;
- redirects permanentes das páginas legadas para as seções atuais;
- assets mutáveis versionados para evitar cache antigo após deploy.

## Execução local

Não há etapa de build.

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Links profissionais

- Site: https://www.s4muelxl.com
- GitHub: https://github.com/s4muelxl
- LinkedIn: https://linkedin.com/in/samuel-alves-277015332

## Licença

Conteúdo e identidade visual deste portfólio são de uso pessoal de Samuel Alves.
