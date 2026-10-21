const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const projects = require("../data/projects");
const root = path.resolve(__dirname, "..");
const base = "https://www.s4muelxl.com";
const e = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const write = (p, c) => {
  fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
  fs.writeFileSync(path.join(root, p), c);
};
const hash = (p) =>
  crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(root, p)))
    .digest("hex")
    .slice(0, 12);
const css = "/style.css?v=" + hash("style.css"),
  js = "/script.js?v=" + hash("script.js");
const linkedin = "https://linkedin.com/in/samuel-alves-277015332";
const github = "https://github.com/s4muelxl";
const cv = "/assets/curriculo_samuel_alves_dev_v2.pdf";
const ext = (url, label, cls = "text-link") =>
  `<a class="${cls}" href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)} <span aria-hidden="true">↗</span></a>`;
const tags = (a) =>
  `<ul class="tags" aria-label="Tecnologias">${a.map((x) => `<li>${e(x)}</li>`).join("")}</ul>`;
const header = `<a class="skip" href="#main">Pular para o conteúdo</a><header class="header"><div class="container header-inner"><a class="brand" href="/" aria-label="Samuel Alves / dev — início"><span class="brand-mark" aria-hidden="true">SA</span>Samuel Alves<span class="muted">/ dev</span></a><button class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="navigation" hidden>Menu <span aria-hidden="true">☰</span></button><nav class="nav" id="navigation" aria-label="Navegação principal"><a href="/#projetos">Projetos</a><a href="/#experiencia">Na prática</a><a href="/#tecnologias">Tecnologias</a><a href="/#formacao">Formação</a><a class="nav-contact" href="/#contato">Contato <span aria-hidden="true">↗</span></a></nav></div></header>`;
const footer = `<footer class="footer"><div class="container"><span>© 2026 Samuel Alves · Engenharia de Software</span><a href="${github}" target="_blank" rel="noopener noreferrer">Desenvolvido com HTML, CSS e JavaScript ↗</a><a href="#main">Voltar ao topo ↑</a></div></footer>`;
const person = {
  "@type": "Person",
  "@id": base + "/#samuel",
  name: "Samuel Alves",
  url: base + "/",
  sameAs: [github, linkedin],
  description:
    "Estudante de Engenharia de Software na Universidade São Judas Tadeu.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidade São Judas Tadeu",
  },
};
const hashes = new Set();
function page(title, description, url, body, schema) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    ...schema,
  }).replace(/</g, "\\u003c");
  hashes.add(
    "'sha256-" +
      crypto.createHash("sha256").update(json).digest("base64") +
      "'",
  );
  return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(description)}"><meta name="theme-color" content="#080b12"><link rel="canonical" href="${base + url}"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${base + url}"><meta property="og:image" content="${base}/assets/og-portfolio.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Samuel Alves — Engenharia de Software e projetos"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(description)}"><meta name="twitter:image" content="${base}/assets/og-portfolio.png"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"><link rel="stylesheet" href="${css}"><script type="application/ld+json">${json}</script><script src="${js}" defer></script></head><body>${header}${body}${footer}</body></html>`;
}
function links(p) {
  return `${p.demo ? ext(p.demo, p.slug === "bmi9" ? "Abrir site" : "Abrir aplicação", "button primary") : ""}${p.github ? ext(p.github, "GitHub") : ""}${p.private ? '<p class="private">Repositório privado · código não disponível publicamente</p>' : ""}`;
}
function visual(p) {
  return `<figure class="project-visual"><div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span>${new URL(p.demo).hostname}</span></div><img src="${p.image}" alt="${e(p.imageAlt)}" width="1440" height="1000" loading="lazy" decoding="async"><figcaption class="image-caption">${p.slug === "nexo" || p.slug === "saberx" ? "Tela pública de acesso à aplicação" : "Captura da aplicação publicada"}</figcaption></figure>`;
}
const certs = [
  ["Cisco", "Defesa de Rede & Segurança de Endpoint", "2025"],
  ["Alura", "Ciência de Dados & IA com Python", "2026"],
  ["FIAP", "Big Data & Análise de Dados", "2025"],
  ["FGV EPGE", "SQL — Structured Query Language", "2025"],
  ["Santander", "Desenvolvimento Inteligente com IA & Python", "2025"],
  ["Alura", "Desenvolvimento Web com HTML e CSS", "2026"],
  ["Cisco", "Introdução à Cibersegurança & Fundamentos de Segurança", "2025"],
  ["Santander", "Power BI & Modelagem de Dados", "2025"],
  ["Santander / Alura", "Excel Avançado", "2025"],
];
const certList = (a) =>
  `<ul class="cert-list">${a.map(([org, name, year]) => `<li><strong>${org}</strong><div>${name}<small>${year}</small></div></li>`).join("")}</ul>`;
const featured = projects.filter((p) => p.featured);
let repos = [];
try {
  repos = JSON.parse(
    fs.readFileSync(path.join(root, "data/github-public.json")),
  ).repos;
} catch {}
const home = `<main id="main"><section class="hero"><div class="container"><div class="hero-grid"><div><p class="eyebrow"><span class="dot"></span>Em formação. Construindo na prática.</p><h1>Samuel <span>Alves</span></h1><p class="subtitle">Engenharia de Software • Desenvolvimento • Dados & IA</p><p class="hero-description">Construo aplicações web, sistemas inteligentes e produtos digitais com foco em arquitetura, performance e experiência.</p><div class="actions"><a class="button primary" href="#projetos">Ver projetos <span aria-hidden="true">↓</span></a>${ext(github, "GitHub", "button")}</div><div class="hero-links">${ext(linkedin, "LinkedIn")}<a class="text-link" href="${cv}" download="Curriculo_Samuel_Alves.pdf">Baixar currículo <span aria-hidden="true">↓</span></a></div></div><aside class="hero-art" aria-label="Áreas de desenvolvimento"><div class="art-top"><span>SOFTWARE / EM CONSTRUÇÃO</span><span class="art-dots" aria-hidden="true">•••</span></div><div class="art-person"><img class="portrait" src="/assets/samuel.webp" width="58" height="58" alt="Samuel Alves"><div><strong>Do problema ao produto.</strong><p>Interface, dados e o que conecta os dois.</p></div></div><div class="system-map"><div class="system-row"><span>Interfaces & experiência</span><span>React / TypeScript</span></div><div class="system-row"><span>Serviços & inteligência</span><span>APIs / IA / WebRTC</span></div><div class="system-row"><span>Dados & segurança</span><span>PostgreSQL / RLS</span></div></div><div class="art-bottom">APRENDER → CONSTRUIR → TESTAR → EVOLUIR</div></aside></div><div class="hero-index"><span>PROJETOS SELECIONADOS</span><a href="/projects/nexo/">01 / NEXO</a><a href="/projects/cbcdegelo/">02 / CABEÇA DE GELO</a><a href="/projects/saberx/">03 / SABERX</a><a href="/projects/bmi9/">04 / BMI9</a></div></div></section>
<section class="section" id="projetos"><div class="container"><div class="section-heading"><div><div class="label">01 / Projetos selecionados</div><h2>Software que sai<br>do repositório.</h2></div><p>Produtos pessoais e uma aplicação empresarial. Conheça o problema, a arquitetura e as decisões por trás de cada projeto.</p></div><div class="projects">${featured.map((p, i) => `<article class="project">${visual(p)}<div><p class="number">0${i + 1} / ${e(p.category)}</p><span class="badge">${e(p.status)}</span><h3>${e(p.name)}</h3><p class="project-summary">${e(p.summary)}</p>${tags(p.technologies.slice(0, 5))}<ul class="highlights">${p.highlights.map((x) => `<li>${e(x)}</li>`).join("")}</ul><div class="actions"><a class="button" href="/projects/${p.slug}/">Ver detalhes <span aria-hidden="true">→</span></a>${ext(p.demo, p.slug === "bmi9" ? "Abrir site" : "Abrir aplicação")}${p.github ? ext(p.github, "GitHub") : ""}</div>${p.private ? '<p class="private">Repositório privado</p>' : ""}</div></article>`).join("")}</div><h3 class="subheading">Outros projetos</h3><div class="other-grid"><article class="small-card"><div class="label">Python / Automação</div><h3>Receipt Generator Py</h3><p>${e(projects[4].summary)}</p>${tags(["Python", "CLI", "Validação", "Arquivos"])}<div class="actions"><a class="text-link" href="/projects/receipt-generator-py/">Ver detalhes →</a>${ext(projects[4].github, "GitHub")}</div></article><article class="small-card"><div class="label">Estudo / Desenvolvimento web</div><h3>FinanceCalc Pro</h3><p>Projeto de estudo de calculadoras financeiras e simulações, com HTML, CSS e JavaScript. Um espaço para praticar lógica e interfaces.</p>${tags(["JavaScript", "HTML", "CSS"])}${ext(github + "/projeto-1-calculadora-simples", "Explorar repositório")}</article></div></div></section>
<section class="section" id="experiencia"><div class="container"><div class="section-heading"><div><div class="label">02 / Experiência na prática</div><h2>Construir para aprender.<br>Entregar para resolver.</h2></div><p>Minha experiência prática vem do desenvolvimento destes projetos, enquanto curso Engenharia de Software.</p></div><div class="practice"><article><h3>BMI9</h3><p>Website utilizado por uma empresa real, conectando apresentação de serviços e pedidos de orçamento.</p></article><article><h3>NEXO</h3><p>Produto pessoal em evolução contínua, integrando interface mobile, banco de dados e um agente de IA.</p></article><article><h3>Cabeça de Gelo</h3><p>Comunicação em tempo real: gerenciar mídia, conexão e permissões além da interface.</p></article><article><h3>SaberX</h3><p>Tradução de regras de planilhas em um sistema de cotação com validações e persistência.</p></article></div></div></section>
<section class="section" id="tecnologias"><div class="container"><div class="section-heading"><div><div class="label">03 / Repertório técnico</div><h2>Tecnologia com contexto.</h2></div><p>Ferramentas aplicadas nos projetos e conhecimentos desenvolvidos durante minha formação.</p></div><div class="tech-grid">${[
  [
    "Desenvolvimento",
    "TypeScript · JavaScript · Python · HTML · CSS · React · Next.js",
    "Aplicados nos projetos selecionados.",
  ],
  [
    "Dados",
    "SQL · PostgreSQL · Supabase · Pandas · Power BI",
    "Banco de dados nos produtos; análise de dados na formação.",
  ],
  [
    "IA",
    "Integração de modelos · Machine Learning · Scikit-Learn · TensorFlow · OpenCV",
    "Agent no NEXO; fundamentos e bibliotecas na formação.",
  ],
  [
    "Infra / Cloud",
    "Vercel · Docker · AWS",
    "Deploy web, ambiente local e fundamentos de cloud.",
  ],
  [
    "Engenharia & segurança",
    "Git · GitHub · RLS · REST APIs · Arquitetura de Software",
    "Versionamento, separação de responsabilidades e controle de acesso.",
  ],
  [
    "Redes & tempo real",
    "WebRTC · LiveKit · SFU · Cibersegurança",
    "Comunicação no Cabeça de Gelo e formação Cisco.",
  ],
]
  .map(
    ([t, c, n]) =>
      `<article class="tech-group"><h3>${t}</h3><p>${c}</p><small>${n}</small></article>`,
  )
  .join("")}</div></div></section>
<section class="section" id="formacao"><div class="container education"><div><div class="label">04 / Formação</div><h2>Base para continuar<br>evoluindo.</h2><h3>Bacharelado em<br>Engenharia de Software</h3><p>Universidade São Judas Tadeu</p><p>2025–2028 <span class="badge">Em andamento</span></p><p>São Paulo, SP · Inglês intermediário (B1)</p><a class="text-link" href="${cv}" target="_blank" rel="noopener noreferrer">Abrir currículo em PDF ↗</a></div><div id="certificacoes"><div class="label">Certificações & cursos</div>${certList(certs.slice(0, 5))}<details><summary>Ver todas as certificações</summary>${certList(certs.slice(5))}</details></div></div></section>
<section class="section" id="codigo"><div class="container code-panel"><div><div class="label">05 / GitHub</div><h2>Código e projetos.</h2><p>TypeScript, JavaScript e Python em aplicações, ferramentas e estudos. Explore o código dos projetos públicos.</p>${ext(github + "?tab=repositories", "Ver todos os repositórios", "button")}</div><ul class="repo-list">${(repos.length
  ? repos.slice(0, 4)
  : [
      { name: "saberx", language: "TypeScript" },
      { name: "bmi9.lol", language: "Python / JavaScript" },
      { name: "receipt-generator-py", language: "Python" },
      { name: "projeto-1-calculadora-simples", language: "JavaScript" },
    ]
)
  .map(
    (r) =>
      `<li>${ext(github + "/" + r.name, r.name)}<span>${e(r.language || "Software")}${r.updated_at ? " · Atualizado em " + new Date(r.updated_at).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : ""}</span></li>`,
  )
  .join("")}</ul></div></section>
<section class="contact" id="contato"><div class="container"><div class="label">Próximo passo / Vamos conversar</div><h2>Vamos construir<br>algo interessante?</h2><p>Busco oportunidades de estágio e posições júnior em tecnologia. Também estou aberto a colaboração e conversas sobre software, dados e IA.</p><div class="actions">${ext(linkedin, "LinkedIn", "button primary")}<a class="button" href="mailto:corporativosamuel8877alves@gmail.com">E-mail ↗</a>${ext(github, "GitHub", "button")}${ext("https://wa.me/5511963544001", "WhatsApp", "button")}</div></div></section></main>`;
write(
  "index.html",
  page(
    "Samuel Alves | Engenharia de Software, Desenvolvimento, Dados & IA",
    "Portfólio de Samuel Alves: aplicações web, PWA, IA e comunicação em tempo real. Conheça NEXO, Cabeça de Gelo, SaberX e BMI9.",
    "/",
    home,
    {
      "@graph": [
        person,
        ...featured.map((p) => ({
          "@type": "CreativeWork",
          name: p.name,
          description: p.summary,
          url: base + "/projects/" + p.slug + "/",
          creator: { "@id": base + "/#samuel" },
        })),
      ],
    },
  ),
);
for (const p of projects) {
  const parts = [
    ["contexto", "Contexto", `<p>${e(p.description)}</p>`],
    ["problema", "Problema", `<p>${e(p.problem)}</p>`],
    ["solucao", "Solução", `<p>${e(p.solution)}</p>`],
    [
      "arquitetura",
      "Arquitetura",
      `<ol class="architecture">${p.architecture.map(([a, b]) => `<li><strong>${e(a)}</strong><span>${e(b)}</span></li>`).join("")}</ol>`,
    ],
    [
      "decisoes",
      "Principais decisões técnicas",
      `<ul>${p.decisions.map((x) => `<li>${e(x)}</li>`).join("")}</ul>`,
    ],
    ["stack", "Stack", tags(p.technologies)],
    [
      "desafios",
      "Desafios",
      `<ul>${p.challenges.map((x) => `<li>${e(x)}</li>`).join("")}</ul>`,
    ],
    [
      "aprendizados",
      "O que aprendi",
      `<ul>${p.learnings.map((x) => `<li>${e(x)}</li>`).join("")}</ul>`,
    ],
  ];
  write(
    `projects/${p.slug}/index.html`,
    page(
      `${p.name} — Estudo de caso | Samuel Alves`,
      p.summary,
      `/projects/${p.slug}/`,
      `<main id="main" class="container"><div class="case-hero"><a class="text-link" href="/#projetos">← Todos os projetos</a><p class="label">${e(p.category)}</p><h1>${e(p.name)}</h1><p>${e(p.summary)}</p><div class="actions">${links(p)}</div></div>${p.image ? `<figure class="case-cover"><img src="${p.image}" alt="${e(p.imageAlt)}" width="1440" height="1000" fetchpriority="high"></figure>` : ""}<div class="case-layout"><nav class="case-nav" aria-label="Neste estudo de caso">${parts.map(([id, title]) => `<a href="#${id}">${title}</a>`).join("")}</nav><div class="case-content">${parts.map(([id, title, content]) => `<section id="${id}"><h2>${title}</h2>${content}</section>`).join("")}<section><h2>Explore o projeto</h2><div class="actions">${links(p)}</div><a class="text-link" href="/#projetos">← Voltar aos projetos</a></section></div></div></main>`,
      {
        "@graph": [
          person,
          {
            "@type": "CreativeWork",
            name: p.name,
            description: p.summary,
            url: base + `/projects/${p.slug}/`,
            creator: { "@id": base + "/#samuel" },
            keywords: p.technologies.join(", "),
          },
        ],
      },
    ),
  );
}
const redirects = {
  "projetos.html": "projetos",
  "about.html": "experiencia",
  "especialidades.html": "tecnologias",
  "formacao.html": "formacao",
  "contato.html": "contato",
};
for (const [file, id] of Object.entries(redirects))
  write(
    file,
    `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/#${id}"><title>Samuel Alves</title><link rel="canonical" href="${base}/#${id}"></head><body><a href="/#${id}">Continuar para ${id}</a></body></html>`,
  );
write(
  "404.html",
  page(
    "Página não encontrada | Samuel Alves",
    "Esta página não foi encontrada.",
    "/404.html",
    '<main id="main" class="container not-found"><p class="label">404 / Página não encontrada</p><h1>Vamos voltar<br>aos projetos?</h1><a class="button primary" href="/#projetos">Ver projetos →</a></main>',
    { "@type": "WebPage", name: "Página não encontrada" },
  ),
);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", ...projects.map((p) => "/projects/" + p.slug + "/")].map((u) => `<url><loc>${base + u}</loc></url>`).join("")}</urlset>`,
);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
const config = {
  version: 2,
  buildCommand: "npm run build",
  outputDirectory: "dist",
  redirects: Object.entries(redirects).map(([source, id]) => ({
    source: "/" + source,
    destination: "/#" + id,
    permanent: true,
  })),
  headers: [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: `default-src 'self'; script-src 'self' ${[...hashes].join(" ")}; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests`,
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), payment=()",
        },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
      ],
    },
    {
      source: "/assets/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, must-revalidate",
        },
      ],
    },
  ],
};
write("vercel.json", JSON.stringify(config, null, 2) + "\n");
fs.rmSync(path.join(root, "dist"), { recursive: true, force: true });
fs.mkdirSync(path.join(root, "dist"));
for (const file of [
  "index.html",
  "404.html",
  ...Object.keys(redirects),
  "style.css",
  "script.js",
  "sitemap.xml",
  "robots.txt",
  "projects",
])
  fs.cpSync(path.join(root, file), path.join(root, "dist", file), {
    recursive: true,
  });
fs.mkdirSync(path.join(root, "dist/assets"));
for (const file of [
  "projects",
  "samuel.webp",
  "og-portfolio.png",
  "favicon.svg",
  "apple-touch-icon.png",
  "curriculo_samuel_alves_dev_v2.pdf",
])
  fs.cpSync(
    path.join(root, "assets", file),
    path.join(root, "dist/assets", file),
    { recursive: true },
  );
console.log(
  "Built static portfolio: 5 case studies. Only public assets included.",
);
