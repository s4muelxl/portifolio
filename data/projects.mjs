// Editorial metadata is shared by static generation and integrity checks.
// Existing project descriptions remain in their original HTML.
export const projects = [
  {
    id: 'nexo', homeId: 'projeto-nexo', title: 'NEXO', repo: 'https://github.com/s4muelxl/nexo',
    source: 'https://github.com/s4muelxl/nexo/blob/main/package.json',
    question: 'Como manter vários domínios em uma experiência coerente?',
    decision: 'Separar estado local e dados remotos: Zustand organiza a interface; TanStack Query trata consultas e sincronização.',
    tradeoff: 'A separação exige fronteiras claras entre os módulos e cuidado com atualização de cache quando uma ação afeta mais de uma área.',
    graph: {
      label: 'Visão simplificada: interface Expo e React Native Web, estado com TanStack Query e Zustand, e serviços Supabase para identidade, dados e operações no servidor.',
      nodes: [
        {id:'interface',slot:'a',label:'Interface',detail:'Expo Router · React Native Web'},
        {id:'state',slot:'b',label:'Dados e estado',detail:'TanStack Query · Zustand'},
        {id:'auth',slot:'c',label:'Identidade',detail:'Supabase Auth'},
        {id:'database',slot:'d',label:'Dados do usuário',detail:'PostgreSQL · RLS'},
        {id:'server',slot:'e',label:'Operações no servidor',detail:'Edge Functions'}
      ],
      edges:[['interface','state'],['state','auth'],['state','database'],['state','server']]
    }
  },
  {
    id: 'cbcdegelo', homeId: 'projeto-cbcdegelo', title: 'Cabeça de Gelo', repo: 'https://github.com/s4muelxl/cbcdegelo',
    source: 'https://github.com/s4muelxl/cbcdegelo/blob/main/README.md',
    question: 'Como separar o controle da sala do transporte de mídia?',
    decision: 'A aplicação organiza salas e credenciais; o LiveKit SFU distribui voz e compartilhamento de tela entre participantes.',
    tradeoff: 'A mídia tem um ciclo de vida próprio. Reconexão, encerramento de tracks e leitura de qualidade precisam acompanhar mudanças da rede.',
    graph: {
      label:'Visão simplificada: a API de salas emite credenciais para dois participantes. A mídia WebRTC de cada participante passa pelo LiveKit SFU.',
      nodes:[
        {id:'api',slot:'a',label:'Salas e credenciais',detail:'API da aplicação · Next.js'},
        {id:'participant-a',slot:'c',label:'Participante A',detail:'Navegador · WebRTC'},
        {id:'participant-b',slot:'d',label:'Participante B',detail:'Navegador · WebRTC'},
        {id:'sfu',slot:'e',label:'Distribuição de mídia',detail:'LiveKit SFU · voz e tela'}
      ],
      edges:[['api','participant-a'],['api','participant-b'],['participant-a','sfu'],['participant-b','sfu']]
    }
  },
  {
    id:'bmi9',homeId:'projeto-bmi9',title:'BMI9',repo:'https://github.com/s4muelxl/bmi9.lol',
    source:'https://github.com/s4muelxl/bmi9.lol',
    question:'Como levar o interesse do visitante até uma proposta?',
    decision:'Manter a apresentação no frontend e concentrar geração de PDF e entrega de e-mail no backend Python/Flask.',
    tradeoff:'A entrega depende de serviços externos. Uma rota alternativa de e-mail reduz a dependência de um único provedor.',
    graph:{
      label:'Visão simplificada: o formulário envia dados ao backend Flask, que gera a proposta em PDF e realiza o envio de e-mail com rota alternativa SMTP.',
      nodes:[
        {id:'web',slot:'a',label:'Site e formulário',detail:'HTML · CSS · JavaScript'},
        {id:'api',slot:'b',label:'Fluxo comercial',detail:'Python · Flask serverless'},
        {id:'pdf',slot:'c',label:'Proposta',detail:'Geração de PDF'},
        {id:'email',slot:'d',label:'Entrega de e-mail',detail:'Resend'},
        {id:'fallback',slot:'e',label:'Rota alternativa',detail:'SMTP'}
      ],edges:[['web','api'],['api','pdf'],['api','email'],['email','fallback']]
    }
  },
  {
    id:'saberx',homeId:'projeto-saberx',title:'SaberX',repo:'https://github.com/s4muelxl/saberx',source:'https://github.com/s4muelxl/saberx',
    question:'Como transformar planilhas em uma operação multiusuário?',
    decision:'Centralizar produtos, fornecedores e cotações em PostgreSQL, com autenticação e isolamento por organização via RLS.',
    tradeoff:'As regras de acesso precisam acompanhar o modelo de dados. Uma interface correta também depende de políticas coerentes no banco.'
  },
  {
    id:'receipt-generator',homeId:'projeto-recibos',title:'Gerador de Recibos',repo:'https://github.com/s4muelxl/receipt-generator-py',
    source:'https://github.com/s4muelxl/receipt-generator-py/blob/main/gerador_recibo.py',
    question:'Como reduzir cálculos e formatação feitos à mão?',
    decision:'Validar entradas, calcular subtotais e construir o recibo em UTF-8 usando a biblioteca padrão do Python.',
    tradeoff:'A execução local simplifica a instalação e o armazenamento. A demonstração deste portfólio adapta a interação ao navegador, sem executar Python no cliente.'
  }
];
