# Continuidade do portfólio

Se os créditos do modo de trabalho acabarem, continue no chat normal com este registro. Não é necessário recomeçar o projeto. A troca de modo não acontece automaticamente.

## Mensagem para colar no chat normal

Continue as melhorias do meu portfólio em https://www.s4muelxl.com, repositório s4muelxl/portifolio. Leia primeiro CONTINUAR_PORTFOLIO.md e o código atual da main. Preserve o domínio, a infraestrutura, o preto e branco, os cinco projetos, fotos, currículo e links. Meu perfil é de estudante buscando estágio/júnior. Não invente competências, resultados ou experiência. Confira commits, PRs e deploys antes de repetir trabalho. Se não houver acesso às ferramentas, descreva o próximo patch com base nos arquivos que eu fornecer, sem afirmar que publicou ou testou.

## Rodada 1 concluída

- PR #13 integrado; produção confirmada no commit db326c54983ae2a6841e64e4ed4eb82ae8b70df5.
- Currículo de uma página, com cinco projetos e links aos cases; URL datada evita o cache anterior.
- NEXO e Cabeça de Gelo identificados como código privado; os repositórios não foram tornados públicos.
- Demonstração de recibos independente da navegação, com validação do DOM.
- Uma única revelação de conteúdo, movimento reduzido em execução e remoção de cursor/parallax.
- Cache de assets com revalidação e ajustes de contraste e âncoras.
- 13 testes aprovados; CI com Chromium/WebKit e matriz visual de nove larguras aprovado.

## Rodada 2 concluída

PR #14 integrado; produção confirmada no commit 87cddf8ac6f6d76885b4a01a0820b40abaac7eb9.

- Código separado em módulos de navegação, foco, galerias, contato, prefetch e posição de leitura. O carregamento das galerias é isolado do menu.
- Manrope e Fira Code locais em WOFF2, com licenças, hash e preload da fonte principal.
- Estado de erro recuperável no lightbox, foco consistente e economia de dados nos preloads.
- Núcleo de recibos com contratos JSDoc e verificação TypeScript estrita; não se trata de tipagem de toda a aplicação DOM.
- Testes locais: 13 testes e contratos estritos aprovados. A matriz de navegador cobre falhas de imagem/módulos, fontes locais e economia de dados.
- CI Chromium/WebKit e nove larguras aprovados antes da integração.

## Rodada 3: implementação e homologação

Branch: improve/design-system-a11y-20261025. Consultar sua PR, CI e deploy para o estado exato.

- CSS organizado em fontes legíveis em styles/ e consolidado em portfolio.bundle.css. Manter a ordem da cascata e regenerar com npm run build:css.
- Ferramentas de desenvolvimento com versões fixadas em package-lock.json; o site permanece estático na Vercel.
- Auditoria axe em Chromium/WebKit, navegação por skip link e reflow; Lighthouse mobile simulado nas duas páginas.
- A primeira execução identificou contraste insuficiente em navContext; o texto foi ajustado para o token secundário, com tamanho de 10px.
- Fontes latinas somam 74.848 bytes em vez de 160.320 bytes dos arquivos completos. Fira Code opcional evita troca tardia; ambos os arquivos são priorizados.
- A medição local passou a servir texto com gzip. Não comparar diretamente as pontuações dessa configuração com as execuções anteriores sem compressão.
- Relatórios são artefatos do workflow, não dados reais de usuários. Corrigir as violações encontradas antes de integrar.

## Pendências da auditoria

- Consultar os relatórios Lighthouse do CI para performance em laboratório. Dados reais de LCP/INP/CLS ainda precisam de volume e instrumentação próprios; não inventar resultados de produção.
- Continuar a simplificação de regras CSS sobrepostas; tokens e fontes legíveis já estão organizados.
- Revisar acessibilidade manualmente com leitor de tela e zoom de 200%.
- Revisar materiais antigos e a pasta skill.md; ela está fora do deploy. Não apagar conteúdo sem analisar sua finalidade.
- Verificar provas de cursos/certificações e acesso anônimo aos links públicos.

## Verificação

Projeto estático: HTML, CSS e módulos JavaScript; não migrar para React/Next.js sem necessidade.

```bash
node --test tests/*.test.mjs
node scripts/sync-projects.mjs --check
python3 scripts/check-site.py
```

CI: .github/workflows/portfolio-checks.yml. Projeto Vercel: samuelalves. Não exponha tokens, cookies ou arquivos de ambiente no registro.
