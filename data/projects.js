// Editorial source of truth. Never store credentials or private repository URLs here.
module.exports = [
  {
    name: "NEXO",
    slug: "nexo",
    category: "Produto pessoal · PWA & IA",
    featured: true,
    private: true,
    status: "Em desenvolvimento contínuo",
    demo: "https://nexo-ten-mu.vercel.app",
    github: null,
    image: "/assets/projects/nexo.webp",
    imageAlt: "Tela pública de acesso do NEXO",
    summary:
      "Treino, alimentação, rotina e finanças em uma experiência mobile. Um PWA com dados isolados por usuário e um Agent que conecta os diferentes módulos.",
    description:
      "Aplicação pessoal desenvolvida com Expo Router e React Native Web. Reúne planos de treino, refeições, tarefas, finanças, investimentos e notificações em uma interface integrada.",
    problem:
      "Informações da rotina ficam espalhadas entre aplicativos e planilhas. Reunir esses dados exige manter consistência entre módulos e proteger informações pessoais.",
    solution:
      "Organização por domínios, serviços de dados compartilhados e um dashboard integrado. O Agent combina regras locais para ações confirmadas pelo usuário com análise remota somente-leitura.",
    technologies: [
      "TypeScript",
      "React Native Web",
      "Expo Router",
      "Supabase",
      "PostgreSQL",
      "RLS",
      "TanStack Query",
      "Zustand",
      "Edge Functions",
      "Service Worker",
    ],
    highlights: [
      "Isolamento de dados com RLS",
      "Agent híbrido e múltiplos provedores",
      "Fila offline com idempotência",
    ],
    architecture: [
      ["Interface", "Expo Router · React Native Web"],
      ["Estado e domínio", "TanStack Query · Zustand · regras locais"],
      ["Dados e servidor", "Supabase Auth · RPCs · Edge Functions"],
      ["Persistência e IA", "PostgreSQL com RLS · provedores no backend"],
    ],
    decisions: [
      "Separar telas, regras de negócio e serviços para testar cálculos sem depender da interface.",
      "Usar operações atômicas no banco em escritas que envolvem múltiplas tabelas.",
      "Manter o Agent remoto somente-leitura; ações de escrita passam por confirmação na interface.",
      "Reprocessar operações compatíveis pela fila offline, com idempotência e tentativas limitadas. A sincronização depende de o aplicativo estar ativo e da conexão disponível.",
    ],
    challenges: [
      "Sincronizar diferentes domínios sem duplicar operações após falhas de rede.",
      "Preservar o isolamento por usuário no banco e no contexto enviado à IA.",
      "Equilibrar a experiência de PWA com as diferenças entre navegadores móveis.",
    ],
    learnings: [
      "Modelagem de dados e políticas de acesso precisam acompanhar cada nova funcionalidade.",
      "Retentativas exigem idempotência: repetir uma requisição não pode duplicar um registro.",
      "Uma arquitetura híbrida permite resolver ações previsíveis sem depender de um modelo de linguagem.",
    ],
  },
  {
    name: "Cabeça de Gelo",
    slug: "cbcdegelo",
    category: "Comunicação · Engenharia em tempo real",
    featured: true,
    private: true,
    status: "Em evolução",
    demo: "https://cbcdegelo-opal.vercel.app",
    github: null,
    image: "/assets/projects/cbcdegelo.webp",
    imageAlt:
      "Interface pública de criação e entrada em salas do Cabeça de Gelo",
    summary:
      "Salas temporárias de voz e compartilhamento de tela. WebRTC com LiveKit SFU, qualidade adaptativa e tratamento de reconexão.",
    description:
      "Plataforma web de comunicação para grupos de amigos, com entrada por código, canais de voz e controle de permissões. A experiência é construída em Next.js, React e TypeScript.",
    problem:
      "Comunicação em tempo real precisa continuar utilizável quando a rede oscila, o dispositivo muda ou uma transmissão exige mais recursos.",
    solution:
      "Separação entre controle da sessão e transporte de mídia. O LiveKit SFU distribui áudio e vídeo, enquanto a aplicação gerencia salas, permissões, tokens e políticas de qualidade.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "WebRTC",
      "LiveKit",
      "SFU",
      "Opus",
      "Tailwind CSS",
      "Vitest",
    ],
    highlights: [
      "Mídia distribuída por SFU",
      "Simulcast e seleção de camadas",
      "Telemetria e reconexão",
    ],
    architecture: [
      ["Interface", "Next.js · React · canais e salas"],
      ["Plano de controle", "API Routes · sessão · tokens de acesso"],
      ["Plano de mídia", "WebRTC · LiveKit SFU · Opus"],
      ["Resiliência", "Monitoramento · reconexão · qualidade adaptativa"],
    ],
    decisions: [
      "Emitir tokens de mídia no backend, vinculados às permissões da sessão.",
      "Usar SFU para distribuir mídia entre participantes e camadas de qualidade conforme o cenário.",
      "Priorizar o áudio quando há restrições de banda.",
      "Separar canais em salas de mídia e observar conexão, visibilidade e estado das tracks.",
    ],
    challenges: [
      "Coordenar reconexões e mudanças de canal sem manter tracks antigas.",
      "Adaptar captura e reprodução às capacidades de cada navegador.",
      "Equilibrar nitidez, fluidez e consumo de banda sem prometer uma latência fixa.",
    ],
    learnings: [
      "Qualidade de mídia depende de captura, codificação, rede e reprodução, e precisa ser observada de ponta a ponta.",
      "Máquinas de estado e limpeza de recursos são centrais em aplicações de tempo real.",
      "Um teste simulado não substitui a validação com transmissões reais.",
    ],
  },
  {
    name: "SaberX",
    slug: "saberx",
    category: "Software de gestão · Dados & automação",
    featured: true,
    private: false,
    status: "Aplicação publicada",
    demo: "https://saberx-5v9t.vercel.app",
    github: "https://github.com/s4muelxl/saberx",
    image: "/assets/projects/saberx.webp",
    imageAlt: "Tela pública de acesso ao SaberX",
    summary:
      "Da planilha ao sistema: cotações, compras e vendas com regras de cálculo, validação de fornecedores, relatórios e persistência em PostgreSQL.",
    description:
      "Sistema de gestão para produtos, fornecedores, cotações, compras e vendas. Transforma o processo de mapa de cotação em fluxos com usuários, permissões e histórico.",
    problem:
      "Comparar propostas em planilhas pode misturar unidades, aceitar quantidades insuficientes e destacar um preço que não atende aos requisitos da compra.",
    solution:
      "Motor de cálculo separado da interface, estados explícitos de validação e comparação entre propostas válidas. Relatórios e exportações conectam o sistema ao fluxo de trabalho existente.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Supabase Auth",
      "PostgreSQL",
      "RLS",
      "Recharts",
      "XLSX",
      "jsPDF",
    ],
    highlights: [
      "Motor de cálculo por unidade",
      "Validação de propostas",
      "Modelo multiusuário com RLS",
    ],
    architecture: [
      ["Interface", "React · Vite · Tailwind CSS"],
      ["Regras de negócio", "Cálculos · validações · comparação"],
      ["Autenticação e dados", "Supabase Auth · PostgreSQL · RLS"],
      ["Saídas", "Relatórios Recharts · XLSX · PDF"],
    ],
    decisions: [
      "Isolar cálculos de quantidade, peso, impostos e margens em funções de domínio.",
      "Comparar o menor preço somente entre cotações válidas.",
      "Modelar organizações e perfis de acesso com políticas RLS.",
      "Oferecer documentos PDF e planilhas para manter a interoperabilidade.",
    ],
    challenges: [
      "Preservar as regras da planilha ao migrar para um sistema persistente.",
      "Explicar por que uma proposta com preço menor não é válida.",
      "Manter consistência entre cálculos, relatórios e documentos exportados.",
    ],
    learnings: [
      "Regras de validação fazem parte do produto, não apenas dos formulários.",
      "Separar o domínio facilita testar casos de borda e unidades diferentes.",
      "Um sistema de gestão precisa considerar permissões desde a modelagem.",
    ],
  },
  {
    name: "BMI9",
    slug: "bmi9",
    category: "Projeto empresarial · Web & backend",
    featured: true,
    private: false,
    status: "Projeto real em produção",
    demo: "https://www.bmi9.com.br/",
    github: "https://github.com/s4muelxl/bmi9.lol",
    image: "/assets/projects/bmi9.webp",
    imageAlt: "Página institucional da BMI9 com apresentação dos serviços",
    summary:
      "Website de uma empresa de pisos industriais, com captação de leads, propostas em PDF e integração de atendimento por e-mail e WhatsApp.",
    description:
      "Projeto desenvolvido para uma necessidade empresarial real: apresentar serviços de construção civil e organizar a entrada de pedidos de orçamento.",
    problem:
      "A presença institucional precisa transformar interesse em pedidos de orçamento com informações úteis para a equipe comercial.",
    solution:
      "Site responsivo com portfólio de serviços, formulário validado e backend Python/Flask para gerar propostas em PDF e encaminhar informações de contato.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "Flask",
      "Vercel",
      "Resend",
      "Redis",
    ],
    highlights: [
      "Necessidade empresarial real",
      "PDF e e-mail no backend",
      "Português e inglês",
    ],
    architecture: [
      ["Website", "HTML · CSS · JavaScript · i18n"],
      ["Backend serverless", "Python · Flask · validação"],
      ["Fluxo comercial", "PDF · Resend / SMTP · WhatsApp"],
      [
        "Persistência complementar",
        "Redis para interações, quando configurado",
      ],
    ],
    decisions: [
      "Manter o frontend em tecnologias nativas, sem adicionar um framework ao site institucional.",
      "Validar entradas no servidor antes de gerar documentos e enviar e-mails.",
      "Separar credenciais de serviços do código entregue ao navegador.",
      "Implementar alternativa SMTP ao envio via Resend e suporte a armazenamento Redis.",
    ],
    challenges: [
      "Conectar apresentação institucional, orçamento e atendimento sem tornar o fluxo complexo.",
      "Gerar documentos legíveis no ambiente serverless.",
      "Tratar falhas nos serviços de e-mail e adaptar o site a diferentes tamanhos de tela.",
    ],
    learnings: [
      "O valor de uma integração está no fluxo completo, do formulário ao atendimento.",
      "Validação, segurança e tratamento de falhas também são requisitos de um website institucional.",
      "SEO, responsividade e clareza de conteúdo fazem parte da entrega técnica.",
    ],
  },
  {
    name: "Receipt Generator Py",
    slug: "receipt-generator-py",
    category: "Automação · Python CLI",
    featured: false,
    private: false,
    status: "Projeto publicado",
    demo: null,
    github: "https://github.com/s4muelxl/receipt-generator-py",
    image: null,
    summary:
      "CLI em Python que valida itens, calcula valores e gera recibos em arquivos de texto com formatação monetária brasileira.",
    description: "Automação para padronizar recibos de pedidos no comércio.",
    problem:
      "Digitar recibos manualmente repete trabalho e dificulta padronizar os valores e arquivos.",
    solution:
      "Coleta de itens pelo terminal, validação de entradas e exportação UTF-8 organizada por cliente e data.",
    technologies: ["Python", "CLI", "Arquivos UTF-8"],
    highlights: [],
    architecture: [
      ["Entrada", "Terminal e validação"],
      ["Processamento", "Cálculos e formatação monetária"],
      ["Saída", "Arquivo de texto UTF-8"],
    ],
    decisions: [
      "Usar a biblioteca padrão do Python.",
      "Aceitar entradas monetárias com vírgula ou ponto.",
      "Normalizar o nome dos arquivos de saída.",
    ],
    challenges: ["Tratar entradas inválidas sem interromper a interação."],
    learnings: [
      "Pequenas automações também exigem cuidado com validação, formato e experiência de uso.",
    ],
  },
];
