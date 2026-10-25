// Editorial metadata is shared by static generation and integrity checks.
// Detailed case narratives live in components/cases/*.html.
export const projects = [
  {
    id: "nexo",
    homeId: "projeto-nexo",
    title: "NEXO",
    visibility: "private",
    repo: "https://github.com/s4muelxl/nexo",
    problem:
      "Reunir treino, refeições, finanças e rotina sem fragmentar a experiência.",
    contribution:
      "Interface, regras de negócio e integração de autenticação, dados e estado com Supabase.",
    evidence: "13 telas reais dos fluxos do produto.",
    evidenceTarget: "evidencia-nexo",
    evidenceLabel: "Explorar as telas",
    source: "https://github.com/s4muelxl/nexo/blob/main/package.json",
    question: "Como manter vários domínios em uma experiência coerente?",
    graph: {
      label:
        "Visão simplificada: interface Expo e React Native Web, estado com TanStack Query e Zustand, e serviços Supabase para identidade, dados e operações no servidor.",
      nodes: [
        {
          id: "interface",
          slot: "a",
          label: "Interface",
          detail: "Expo Router · React Native Web",
        },
        {
          id: "state",
          slot: "b",
          label: "Dados e estado",
          detail: "TanStack Query · Zustand",
        },
        { id: "auth", slot: "c", label: "Identidade", detail: "Supabase Auth" },
        {
          id: "database",
          slot: "d",
          label: "Dados do usuário",
          detail: "PostgreSQL · RLS",
        },
        {
          id: "server",
          slot: "e",
          label: "Operações no servidor",
          detail: "Edge Functions",
        },
      ],
      edges: [
        ["interface", "state"],
        ["state", "auth"],
        ["state", "database"],
        ["state", "server"],
      ],
    },
  },
  {
    id: "cbcdegelo",
    homeId: "projeto-cbcdegelo",
    title: "Cabeça de Gelo",
    visibility: "private",
    repo: "https://github.com/s4muelxl/cbcdegelo",
    problem:
      "Manter salas de voz e tela simples enquanto a conexão e a mídia mudam.",
    contribution:
      "Fluxo de salas, permissões, interface e integração LiveKit com reconexão e diagnóstico.",
    evidence: "5 telas desktop, 9 mobile e fluxo de mídia documentado.",
    evidenceTarget: "evidencia-cbcdegelo",
    evidenceLabel: "Explorar desktop e mobile",
    source: "https://github.com/s4muelxl/cbcdegelo/blob/main/README.md",
    question: "Como separar o controle da sala do transporte de mídia?",
    graph: {
      label:
        "Visão simplificada: a API de salas emite credenciais para dois participantes. A mídia WebRTC de cada participante passa pelo LiveKit SFU.",
      nodes: [
        {
          id: "api",
          slot: "a",
          label: "Salas e credenciais",
          detail: "API da aplicação · Next.js",
        },
        {
          id: "participant-a",
          slot: "c",
          label: "Participante A",
          detail: "Navegador · WebRTC",
        },
        {
          id: "participant-b",
          slot: "d",
          label: "Participante B",
          detail: "Navegador · WebRTC",
        },
        {
          id: "sfu",
          slot: "e",
          label: "Distribuição de mídia",
          detail: "LiveKit SFU · voz e tela",
        },
      ],
      edges: [
        ["api", "participant-a"],
        ["api", "participant-b"],
        ["participant-a", "sfu"],
        ["participant-b", "sfu"],
      ],
    },
  },
  {
    id: "bmi9",
    homeId: "projeto-bmi9",
    title: "BMI9",
    repo: "https://github.com/s4muelxl/bmi9.lol",
    problem:
      "Apresentar serviços e receber solicitações de orçamento para uma empresa real.",
    contribution:
      "Site responsivo, formulário e integração com backend para gerar PDF e enviar e-mail.",
    evidence: "Site publicado, fotos do contexto do cliente e backend público.",
    evidenceTarget: "evidencia-bmi9",
    evidenceLabel: "Ver o contexto do cliente",
    source: "https://github.com/s4muelxl/bmi9.lol",
    question: "Como levar o interesse do visitante até uma proposta?",
    graph: {
      label:
        "Visão simplificada: o formulário envia dados ao backend Flask, que gera a proposta em PDF e realiza o envio de e-mail com rota alternativa SMTP.",
      nodes: [
        {
          id: "web",
          slot: "a",
          label: "Site e formulário",
          detail: "HTML · CSS · JavaScript",
        },
        {
          id: "api",
          slot: "b",
          label: "Fluxo comercial",
          detail: "Python · Flask serverless",
        },
        { id: "pdf", slot: "c", label: "Proposta", detail: "Geração de PDF" },
        {
          id: "email",
          slot: "d",
          label: "Entrega de e-mail",
          detail: "Resend",
        },
        {
          id: "fallback",
          slot: "e",
          label: "Rota alternativa",
          detail: "SMTP",
        },
      ],
      edges: [
        ["web", "api"],
        ["api", "pdf"],
        ["api", "email"],
        ["email", "fallback"],
      ],
    },
  },
  {
    id: "saberx",
    homeId: "projeto-saberx",
    title: "SaberX",
    repo: "https://github.com/s4muelxl/saberx",
    source: "https://github.com/s4muelxl/saberx",
    problem:
      "Comparar propostas de fornecedores com regras de quantidade e elegibilidade.",
    contribution:
      "Interface web, cálculo e validação de cotações e integração com Supabase.",
    evidence:
      "Regra e teste públicos: propostas com quantidade insuficiente ficam fora da comparação.",
    evidenceTarget: "evidencia-saberx",
    evidenceLabel: "Consultar regra e teste",
    question: "Como transformar planilhas em uma operação multiusuário?",
  },
  {
    id: "receipt-generator",
    homeId: "projeto-recibos",
    title: "Gerador de Recibos",
    repo: "https://github.com/s4muelxl/receipt-generator-py",
    problem:
      "Transformar itens e valores em um recibo sem calcular e formatar tudo à mão.",
    contribution:
      "Validação de entradas, cálculos, formatação monetária e gravação do arquivo em Python.",
    evidence:
      "Experimente o cálculo e a exportação de texto na adaptação para o navegador.",
    evidenceTarget: "evidencia-receipt-generator",
    evidenceLabel: "Experimentar a demonstração",
    source:
      "https://github.com/s4muelxl/receipt-generator-py/blob/main/gerador_recibo.py",
    question: "Como reduzir cálculos e formatação feitos à mão?",
  },
];
