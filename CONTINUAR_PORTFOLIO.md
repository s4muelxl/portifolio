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

## Rodada 2: implementação e homologação

Branch: improve/accessibility-performance-20261025. Antes de continuar, conferir se a branch já foi integrada à main.

- Código separado em módulos de navegação, foco, galerias, contato, prefetch e posição de leitura. O carregamento das galerias é isolado do menu.
- Manrope e Fira Code locais em WOFF2, com licenças, hash e preload da fonte principal.
- Estado de erro recuperável no lightbox, foco consistente e economia de dados nos preloads.
- Núcleo de recibos com contratos JSDoc e verificação TypeScript estrita; não se trata de tipagem de toda a aplicação DOM.
- Testes locais: 13 testes e contratos estritos aprovados. A matriz de navegador cobre falhas de imagem/módulos, fontes locais e economia de dados.
- Situação de CI, merge e deploy: consultar a PR da branch e o deploy correspondente. Não considerar a rodada publicada somente por este documento existir.

## Pendências da auditoria

- Medir performance em laboratório e, se houver volume suficiente, dados reais de LCP/INP/CLS. Não há números de Core Web Vitals comprovados até aqui.
- Consolidar os tokens e as regras CSS sobrepostas sem alterar a identidade visual.
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
