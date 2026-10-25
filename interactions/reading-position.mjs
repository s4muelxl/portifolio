/** Read geometry first and update section navigation at most once per frame. */
export function initReadingPosition() {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('#scrollProgress');
  const backToTop = document.querySelector('.back-to-top');
  const navContext = document.querySelector('#navContext');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sectionLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  let scrollFrame = 0;
  let previousActiveId = null;
  const updateReadingPosition = () => {
    scrollFrame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const offset = (header?.offsetHeight || 84) + 72;
    let activeId = '';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= offset) activeId = section.id; });
    if (max > 0 && window.scrollY >= max - 4 && sections.length) activeId = sections[sections.length - 1].id;
    // All geometry reads above precede style and attribute writes below.
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    if (backToTop) backToTop.hidden = window.scrollY < 720;
    if (activeId !== previousActiveId) {
      sectionLinks.forEach(link => {
        const active = link.hash === '#' + activeId;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      previousActiveId = activeId;
    }
    if (navContext) {
      const labels = {projetos:'Projetos',competencias:'Skills',certificacoes:'Cursos',formacao:'Formação',contato:'Contato'};
      const nextLabel = labels[activeId] || (location.pathname.includes('projetos') ? 'Projetos' : 'Início');
      if (navContext.textContent !== nextLabel) {
        navContext.textContent = nextLabel;
        if (!reducedMotion.matches && typeof navContext.animate === 'function') navContext.animate([{opacity:.25,transform:'translateY(-3px)'},{opacity:1,transform:'none'}],{duration:180,easing:'ease-out'});
      }
    }
  };
  const scheduleReadingPosition = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateReadingPosition);
  };
  window.addEventListener('scroll', scheduleReadingPosition, {passive: true});
  window.addEventListener('resize', scheduleReadingPosition, {passive: true});
  window.addEventListener('load', scheduleReadingPosition, {once: true});
  window.addEventListener('pageshow', scheduleReadingPosition);
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  });
  updateReadingPosition();

}
