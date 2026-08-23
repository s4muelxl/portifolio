/* ==========================================================================
   PORTFÓLIO SAMUEL ALVES - JAVASCRIPT & GITHUB API INTEGRATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initGitHubProjects();
  initScrollSpy();
});

/* --------------------------------------------------------------------------
   1. MOBILE MENU TOGGLE & SMOOTH SCROLLING
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(href);
          if (targetSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
        navMenu.classList.remove('open');
        if (toggleBtn) toggleBtn.innerHTML = '☰';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   1.1 SCROLLSPY (DESTAQUE AUTOMÁTICO DO MENU)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (current && link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. GITHUB API FETCH & LOCALSTORAGE CACHING (10 MINUTES TTL)
   -------------------------------------------------------------------------- */
const GITHUB_USERNAME = 's4muelxl';
const CACHE_KEY = 'github_repos_s4muelxl_v1';
const CACHE_TIME_KEY = 'github_repos_timestamp_s4muelxl_v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 Minutos

async function initGitHubProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  // Render Skeletons
  renderSkeletons(container, 4);

  try {
    const repos = await getRepositories();
    if (!repos || repos.length === 0) {
      renderEmptyState(container);
      return;
    }
    renderProjects(container, repos);
  } catch (error) {
    console.error('Erro ao carregar repositórios do GitHub:', error);
    renderErrorState(container);
  }
}

async function getRepositories() {
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
  const now = Date.now();

  // Verifica se o cache existe e ainda é válido (dentro de 10 min)
  if (cachedData && cachedTime && (now - parseInt(cachedTime, 10)) < CACHE_TTL_MS) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.warn('Cache corrompido, buscando novamente...');
    }
  }

  // Faz a chamada real à API pública do GitHub
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
  
  if (!response.ok) {
    throw new Error(`Erro na API do GitHub (${response.status})`);
  }

  const repos = await response.json();
  
  // Filtra forks e repos sem descrição se houver repos próprios suficientes
  const filteredRepos = repos.filter(repo => !repo.fork && !repo.archived);
  const finalRepos = filteredRepos.length > 0 ? filteredRepos : repos;

  // Salva no LocalStorage
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(finalRepos));
    localStorage.setItem(CACHE_TIME_KEY, now.toString());
  } catch (e) {
    console.warn('Não foi possível salvar no localStorage:', e);
  }

  return finalRepos;
}

/* --------------------------------------------------------------------------
   3. RENDERERS
   -------------------------------------------------------------------------- */

function renderSkeletons(container, count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card skeleton"></div>
    `;
  }
  container.innerHTML = html;
}

function renderProjects(container, repos) {
  // Ordena por estrelas e por descrição válida primeiro
  const sortedRepos = [...repos].sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
    if (a.description && !b.description) return -1;
    if (!a.description && b.description) return 1;
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  // Exibe apenas os 4 projetos mais importantes e em destaque
  const displayRepos = sortedRepos.slice(0, 4);

  const cardsHtml = displayRepos.map(repo => {
    const lang = repo.language || 'Software';
    const langIcon = getLanguageIcon(lang);
    const updatedDate = new Date(repo.updated_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const description = repo.description || 'Projeto em Engenharia de Software e desenvolvimento de sistemas por Samuel Alves.';

    return `
      <article class="project-card">
        <div class="project-preview">
          <div class="project-preview-icon">${langIcon}</div>
        </div>
        <div class="project-content">
          <div class="project-header-row">
            <h3 class="project-name">${escapeHtml(repo.name)}</h3>
            <span class="project-lang-badge">${escapeHtml(lang)}</span>
          </div>
          <p class="project-desc">${escapeHtml(description)}</p>
          <div class="project-meta-row">
            <div class="project-stats">
              <span class="stat-item" title="Estrelas">⭐ ${repo.stargazers_count}</span>
              <span class="stat-item" title="Forks">🔀 ${repo.forks_count}</span>
              <span class="stat-item" title="Atualizado em">📅 ${updatedDate}</span>
            </div>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-github-link">
              Ver no GitHub →
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Adiciona o grid e um botão elegante para ver o restante no GitHub
  container.innerHTML = `
    ${cardsHtml}
    <div style="grid-column: 1 / -1; text-align: center; margin-top: 1.5rem;">
      <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories" target="_blank" rel="noopener noreferrer" class="btn-outline" style="font-size: 0.92rem; padding: 0.85rem 1.8rem;">
        <span>Ver todos os repositórios no GitHub (${repos.length})</span>
        <span>→</span>
      </a>
    </div>
  `;
}

function renderErrorState(container) {
  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius-md);">
      <p style="color: var(--text-gray-300); margin-bottom: 1.2rem; font-size: 1.05rem;">
        Não foi possível carregar os projetos diretamente do GitHub no momento.
      </p>
      <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories" target="_blank" rel="noopener noreferrer" class="btn-primary">
        Visitar GitHub de Samuel Alves →
      </a>
    </div>
  `;
}

function renderEmptyState(container) {
  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
      <p style="color: var(--text-gray-300);">Nenhum repositório público encontrado no momento.</p>
    </div>
  `;
}

/* Helper Icon Selector per Main Language */
function getLanguageIcon(language) {
  const langLower = (language || '').toLowerCase();
  if (langLower.includes('python')) return '🐍';
  if (langLower.includes('javascript') || langLower.includes('js')) return '🟨';
  if (langLower.includes('typescript') || langLower.includes('ts')) return '🔷';
  if (langLower.includes('html') || langLower.includes('css')) return '🌐';
  if (langLower.includes('sql') || langLower.includes('db')) return '🗄️';
  if (langLower.includes('c#') || langLower.includes('c++') || langLower.includes('java')) return '⚙️';
  return '💻';
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
