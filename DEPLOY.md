# 🚀 Guia de Deploy - Portfólio Samuel Alves

Instruções para colocar seu portfólio online rapidamente em diferentes plataformas.

## 📋 Opções de Hosting Recomendadas

### 1. **Vercel** (RECOMENDADO - FREE & FÁCIL)
```bash
# Pré-requisitos: Node.js instalado

# 1. Instale o Vercel CLI
npm i -g vercel

# 2. No diretório do projeto
vercel

# 3. Siga as instruções (conecte conta GitHub)
# 4. Seu site estará em https://seu-dominio.vercel.app
```

**Vantagens:**
- Deploy automático via Git
- HTTPS grátis
- CDN global
- 0 configuração necessária
- Performance excelente

---

### 2. **Netlify** (MUITO BOM - FREE)
```bash
# Opção A: Conexão com GitHub
# 1. Acesse https://netlify.com
# 2. Clique "New site from Git"
# 3. Selecione seu repositório
# 4. Deploy automático!

# Opção B: Drag & Drop
# 1. Acesse https://app.netlify.com
# 2. Arraste a pasta do projeto
# 3. Pronto!
```

**Vantagens:**
- Interface visual intuitiva
- Deploy muito rápido
- Email forms integrado
- Environment variables
- Preview automático

---

### 3. **GitHub Pages** (GRATUITO)
```bash
# 1. Crie repositório 'username.github.io'
# 2. Faça push dos arquivos
# 3. Seu site está em https://username.github.io
```

**Vantagens:**
- Totalmente gratuito
- Vinculado ao repositório Git
- Certificado SSL automático

**Desvantagens:**
- Sem suporte a rewrite de URLs
- Sem formulários backend

---

### 4. **AWS S3 + CloudFront**
```bash
# Para melhor performance em larga escala

# 1. Crie bucket S3
aws s3 mb s3://seu-dominio.com

# 2. Upload dos arquivos
aws s3 sync . s3://seu-dominio.com --delete

# 3. Configure CloudFront para cache global
# Instruções: https://docs.aws.amazon.com/pt_BR/
```

---

### 5. **Hostinger / Bluehost / SiteGround** (TRADICIONAL)
```bash
# Via FTP/SFTP ou File Manager

# 1. Acesse painel de controle
# 2. Abra File Manager
# 3. Navegue até pasta public_html
# 4. Faça upload dos arquivos
# 5. Configure domínio personalizado
```

---

## 🎯 Passo a Passo: Vercel (Recomendado)

### Preparação
```bash
# 1. Instale Node.js (se não tiver)
# https://nodejs.org

# 2. Instale Vercel CLI
npm install -g vercel

# 3. Faça login
vercel login
```

### Deploy
```bash
# 1. Navegue para seu projeto
cd ~/Desktop/portifolio

# 2. Execute deploy
vercel

# 3. Responda as perguntas:
# - Confirm project setup? → Y
# - Which scope? → Seu nome de usuário
# - Link to existing project? → N
# - Project name? → Portfolio (ou seu nome)
# - Directory? → ./
# - Want to override? → Y

# 4. Pronto! Você verá URL como:
# ✅ Production: https://portfolio-xxxxx.vercel.app
```

### Configurar domínio personalizado (Vercel)
```bash
# Via CLI
vercel domains add seu-dominio.com

# Ou via dashboard:
# 1. https://vercel.com/dashboard
# 2. Selecione seu projeto
# 3. Settings → Domains
# 4. Adicione seu domínio
# 5. Configure DNS do seu registrador
```

---

## 🔐 Variáveis de Ambiente

Se usar formulário com backend, crie `.env`:

```env
# .env (NUNCA faça commit disso!)
FORM_ENDPOINT=https://formspree.io/f/SEU_ID
API_KEY=sua_chave_api
DATABASE_URL=sua_conexao_banco
```

Em JavaScript:
```javascript
const endpoint = process.env.FORM_ENDPOINT;
```

---

## ✅ Checklist Pré-Deploy

- [ ] Todos os links funcionam
- [ ] Imagens carregam corretamente
- [ ] Formulário de contato testado
- [ ] Meta tags revisadas
- [ ] Favicon adicionado
- [ ] Sitemap atualizado
- [ ] robots.txt configurado
- [ ] Performance testada (Lighthouse 90+)
- [ ] Mobile responsivo OK
- [ ] Todos os botões funcionam
- [ ] Links sociais corretos
- [ ] Cache de navegador configurado
- [ ] HTTPS ativado

---

## 🚨 Troubleshooting

### Erro: "404 Not Found"
```bash
# Vercel: Crie vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/$1" }
  ]
}
```

### Formulário não envia
```javascript
// Use Formspree (free)
// 1. Acesse https://formspree.io
// 2. Registre-se
// 3. Crie novo formulário
// 4. Use endpoint no seu form
```

### Imagens lentas
```bash
# Optimize com TinyPNG ou ImageOptim
# Converta para WebP quando possível
# Use lazy loading
```

### Domínio não resolve
```bash
# Aguarde propagação DNS (até 48h)
# Verifique registros DNS:
# A record → IP do servidor
# CNAME → domínio do hosting
```

---

## 📊 Monitoramento Pós-Deploy

### Google Search Console
```
1. Acesse: https://search.google.com/search-console
2. Adicione seu domínio
3. Carregue sitemap.xml
4. Monitore indexação
```

### Google Analytics
```html
<!-- Adicione em head do index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Monitoramento de Performance
```bash
# Use WebPageTest
https://www.webpagetest.org

# Ou PageSpeed Insights
https://pagespeed.web.dev
```

---

## 💰 Custos Estimados

| Plataforma | Domínio | Hosting | TOTAL/Mês |
|-----------|---------|---------|-----------|
| Vercel | R$0-40* | Grátis | R$0-40 |
| Netlify | R$0-40* | Grátis | R$0-40 |
| GitHub Pages | R$0-40* | Grátis | R$0-40 |
| AWS S3 | R$0-40* | ~R$1 | R$1-40 |
| Hostinger | R$0-40* | R$10-30 | R$10-70 |

*Domínio próprio (.com) custa ~R$30-50/ano

---

## 🎯 Próximos Passos

1. ✅ Deploy em Vercel/Netlify
2. ✅ Configurar domínio personalizado
3. ✅ Adicionar Google Analytics
4. ✅ Enviar para Google Search Console
5. ✅ Monitorar performance
6. ✅ Receber feedback
7. ✅ Iterar baseado em dados

---

## 📞 Suporte

- **Vercel Help**: https://vercel.com/support
- **Netlify Support**: https://support.netlify.com
- **GitHub Pages Docs**: https://pages.github.com

Qualquer dúvida, pesquise no Google ou abra issue no GitHub!

---

**Happy deploying! 🚀**
