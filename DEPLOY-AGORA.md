# 🚀 Deploy em 5 Minutos - Vercel

## Passo 1️⃣: Preparação

```bash
# Instale Node.js se ainda não tiver
# Faça download: https://nodejs.org
```

## Passo 2️⃣: Instale Vercel CLI

```bash
npm install -g vercel
```

## Passo 3️⃣: Faça Login

```bash
vercel login
```

Digite seu email e siga as instruções (pode usar GitHub/GitLab/Bitbucket)

## Passo 4️⃣: Deploy!

```bash
# No diretório do portfólio
cd c:\Users\samue\Desktop\portifolio

# Execute
vercel
```

### Respostas Recomendadas:

```
? Set up and deploy? → Y (Sim)
? Which scope? → Seu nome de usuário
? Link to existing project? → N (Não)
? Project name? → portfolio
? Directory? → ./
? Want to override? → Y (Sim)
```

## ✅ Pronto!

Você verá uma URL como:
```
✅ Production: https://portfolio-xxxxx.vercel.app
```

**Copie essa URL e teste no navegador!**

---

## Configurar Domínio Personalizado (Opcional)

Se já tem um domínio (type ex: `seusite.com.br`):

```bash
vercel domains add seusite.com.br
```

Depois configure os DNS no seu registrador (GoDaddy, Namecheap, etc) apontando para Vercel.

---

## Troubleshooting

### Erro: "404 Not Found"
- Vercel já está configurado no `vercel.json` ✅

### Formulário não funciona
- Por enquanto, recomende usar Formspree:
  ```html
  <form action="https://formspree.io/f/SEU_ID" method="POST">
    <!-- campos -->
  </form>
  ```

### Imagens não carregam
- Verifique que as imagens estão em `assets/`
- Paths devem ser: `assets/Imagem.png`

---

## Próximos Passos

1. ✅ Deploy feito?
2. 📊 Compartilhe nos seus canais (LinkedIn, GitHub, Instagram)
3. 📈 Configure Google Analytics
4. 🔍 Submeta sitemap ao Google Search Console

**Parabéns! 🎉 Seu portfólio está no ar!**
