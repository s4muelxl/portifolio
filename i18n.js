/**
 * Samuel Alves Portfolio i18n Engine
 * Supports: pt-BR (default), en-US
 * Persists language choice in localStorage.
 * Includes local JSON fetching with embedded fallback for file:// compatibility.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "samuel-lang";
  const DEFAULT_LANG = "pt-BR";
  const SUPPORTED = ["pt-BR", "en-US"];

  // Embedded fallback translations for file:// protocol (CORS avoidance)
  const FALLBACK_TRANSLATIONS = {
    "pt-BR": {
      "nav": {
        "home": "Início",
        "about": "Sobre",
        "services": "Especialidades",
        "projects": "Projetos",
        "education": "Formação",
        "contact": "Contato",
        "cta": "Falar sobre projeto"
      },
      "hero": {
        "eyebrow": "📍 São Paulo, Brasil | 2026 | Engenharia de Software",
        "title": "Desenvolvimento full stack com visão de <span class=\"hero-highlight\">produto e design.</span>",
        "description": "Sou Samuel Alves, engenheiro em formação especializado em criar interfaces web modernas, APIs robustas e soluções com dados e IA aplicada. Meu diferencial: combino pensamento técnico rigoroso com preocupação genuína com experiência do usuário.",
        "cta1": "Iniciar conversação",
        "cta2": "Ver projetos",
        "cta3": "Conhecer histórico"
      },
      "contact": {
        "form_name": "Nome",
        "form_name_ph": "Como você se chama?",
        "form_email": "E-mail",
        "form_email_ph": "seu@email.com",
        "form_phone": "Telefone (opcional)",
        "form_phone_ph": "(11) 99999-9999",
        "form_type": "Tipo de oportunidade",
        "form_type_sel": "Selecione...",
        "form_type_proj": "Projeto/Freelance",
        "form_type_intern": "Estágio",
        "form_type_pj": "PJ/Colaboração",
        "form_type_other": "Outro",
        "form_msg": "Qual é o seu projeto/oportunidade?",
        "form_msg_ph": "Conte sobre sua ideia, empresa, desafio técnico...",
        "form_submit": "Enviar e conversar"
      },
      "estimator": {
        "title": "⚡ Simulador de Escopo & Stack do Projeto",
        "description": "Selecione o que você precisa e veja uma estimativa técnica instantânea para discutirmos no seu contato.",
        "label_services": "1. Serviços Requeridos (Multiseleção)",
        "fe": "Interface Web (React)",
        "be": "API & Banco de Dados",
        "ai": "IA / Machine Learning",
        "cloud": "Cloud & Deploy (AWS)",
        "label_scale": "2. Escala & Complexidade do Sistema",
        "scale_mvp": "Protótipo / MVP Rápido",
        "scale_mid": "Aplicação Padrão Comercial",
        "scale_corp": "Plataforma Robusta Escalonável",
        "label_timeline": "3. Prazo Desejado (Semanas):",
        "card_title": "Configuração Estimada",
        "metric_complexity": "Índice de Complexidade:",
        "metric_hours": "Horas de Engenharia:",
        "metric_stack": "Stack Sugerida:",
        "metric_investment": "Investimento Estimado:",
        "btn_export": "Exportar Especificação para o Formulário ↓",
        "exported_feedback": "Especificações inseridas no formulário abaixo!",
        "client_name_label": "Nome do Cliente / Empresa",
        "client_name_ph": "Seu nome ou empresa",
        "client_email_label": "E-mail para Contato",
        "client_email_ph": "seu@email.com",
        "btn_pdf": "Gerar Proposta PDF 📄"
      },
      "terminal": {
        "welcome": "Samuel Alves OS v2026.05. Digite 'help' para comandos.",
        "placeholder": "digite um comando...",
        "help_msg": "Comandos disponíveis: 'about' (histórico), 'projects' (trabalhos), 'skills' (tecnologias), 'clear' (limpar), 'matrix' (chuva digital!), 'exit' (fechar)."
      }
    },
    "en-US": {
      "nav": {
        "home": "Home",
        "about": "About",
        "services": "Specialties",
        "projects": "Projects",
        "education": "Education",
        "contact": "Contact",
        "cta": "Discuss Project"
      },
      "hero": {
        "eyebrow": "📍 São Paulo, Brazil | 2026 | Software Engineering Student",
        "title": "Full stack development with a focus on <span class=\"hero-highlight\">product and design.</span>",
        "description": "I am Samuel Alves, a software engineering student specializing in creating modern web interfaces, robust APIs, and solutions with data and applied AI. My differentiator: I combine rigorous technical thinking with genuine concern for user experience.",
        "cta1": "Start Conversation",
        "cta2": "View Projects",
        "cta3": "Learn History"
      },
      "contact": {
        "form_name": "Name",
        "form_name_ph": "What is your name?",
        "form_email": "Email",
        "form_email_ph": "you@email.com",
        "form_phone": "Phone (optional)",
        "form_phone_ph": "(11) 99999-9999",
        "form_type": "Opportunity type",
        "form_type_sel": "Select...",
        "form_type_proj": "Project/Freelance",
        "form_type_intern": "Internship",
        "form_type_pj": "Contract/Collab",
        "form_type_other": "Other",
        "form_msg": "What is your project/opportunity?",
        "form_msg_ph": "Tell me about your idea, company, technical challenge...",
        "form_submit": "Send and connect"
      },
      "estimator": {
        "title": "⚡ Scope & Stack Estimator",
        "description": "Select your requirements to see an instant technical estimate that we can discuss in your message.",
        "label_services": "1. Required Services (Multi-select)",
        "fe": "Web Interface (React)",
        "be": "API & Database",
        "ai": "AI / Machine Learning",
        "cloud": "Cloud & Deployment (AWS)",
        "label_scale": "2. System Scale & Complexity",
        "scale_mvp": "Prototype / Rapid MVP",
        "scale_mid": "Standard Commercial Application",
        "scale_corp": "Robust Scalable Platform",
        "label_timeline": "3. Desired Timeline (Weeks):",
        "card_title": "Estimated Spec",
        "metric_complexity": "Complexity Index:",
        "metric_hours": "Engineering Hours:",
        "metric_stack": "Suggested Stack:",
        "metric_investment": "Estimated Budget:",
        "btn_export": "Export Specs to Contact Form ↓",
        "exported_feedback": "Specs inserted into the contact form below!",
        "client_name_label": "Client / Company Name",
        "client_name_ph": "Your name or company",
        "client_email_label": "Contact Email",
        "client_email_ph": "your@email.com",
        "btn_pdf": "Generate PDF Proposal 📄"
      },
      "terminal": {
        "welcome": "Samuel Alves OS v2026.05. Type 'help' for commands.",
        "placeholder": "type a command...",
        "help_msg": "Available commands: 'about' (history), 'projects' (works), 'skills' (technologies), 'clear' (clean), 'matrix' (digital rain effect!), 'exit' (close)."
      }
    }
  };

  let currentLang = DEFAULT_LANG;
  let translationsCache = {};

  function resolve(obj, path) {
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  function detectLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    const nav = (navigator.language || navigator.userLanguage || "").replace("_", "-");
    if (SUPPORTED.includes(nav)) return nav;
    if (nav.startsWith("pt")) return "pt-BR";
    if (nav.startsWith("en")) return "en-US";

    return DEFAULT_LANG;
  }

  function applyTranslations(translations) {
    // 1. Text translations
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = resolve(translations, key);
      if (val !== null) {
        if (val.includes("<")) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // 2. Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = resolve(translations, key);
      if (val !== null) el.placeholder = val;
    });

    // 3. Aria-labels
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const val = resolve(translations, key);
      if (val !== null) el.setAttribute("aria-label", val);
    });

    // 4. Update <html lang>
    document.documentElement.lang = currentLang;

    // 5. Update switcher buttons active state
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const isActive = btn.dataset.lang === currentLang;
      btn.classList.toggle("active", isActive);
      btn.classList.toggle("lang-btn--active", isActive);
    });

    // Dispatch event
    document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: currentLang, translations } }));
  }

  async function loadTranslations(lang) {
    if (translationsCache[lang]) {
      return translationsCache[lang];
    }

    // Try fetching the JSON file first
    try {
      const response = await fetch(`i18n/${lang}.json`);
      if (response.ok) {
        const data = await response.json();
        translationsCache[lang] = data;
        return data;
      }
    } catch (e) {
      console.warn(`Could not fetch JSON for language ${lang}, falling back to embedded dictionary.`, e);
    }

    // Fallback if fetch fails (CORS or offline)
    const fallback = FALLBACK_TRANSLATIONS[lang];
    if (fallback) {
      translationsCache[lang] = fallback;
      return fallback;
    }

    return null;
  }

  async function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const translations = await loadTranslations(lang);
    if (translations) {
      applyTranslations(translations);
    }
  }

  async function init() {
    currentLang = detectLanguage();

    // Load active language
    const translations = await loadTranslations(currentLang);
    if (translations) {
      applyTranslations(translations);
    }

    // Bind events to the static language switcher buttons in header
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLanguage(btn.dataset.lang);
      });
    });
  }

  // Expose API
  window.i18n = { setLanguage, getCurrentLang: () => currentLang, getTranslations: () => translationsCache[currentLang] || FALLBACK_TRANSLATIONS[currentLang] };

  // Auto-init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
