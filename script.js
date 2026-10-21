document.addEventListener('DOMContentLoaded',()=>{
  const root=document.documentElement;
  const navToggle=document.getElementById('navToggle');
  const navMenu=document.getElementById('navMenu');
  const themeToggle=document.getElementById('themeToggle');
  const progress=document.getElementById('scrollProgress');
  const savedTheme=localStorage.getItem('portfolio-theme');
  if(savedTheme==='light'||savedTheme==='dark') root.dataset.theme=savedTheme;
  updateThemeIcon();

  function updateThemeIcon(){if(themeToggle) themeToggle.textContent=root.dataset.theme==='light'?'☀':'☾'}
  themeToggle?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='light'?'dark':'light';localStorage.setItem('portfolio-theme',root.dataset.theme);updateThemeIcon()});

  navToggle?.addEventListener('click',()=>{const open=navMenu?.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(Boolean(open)));navToggle.textContent=open?'×':'☰'});
  navMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navMenu.classList.remove('open');navToggle?.setAttribute('aria-expanded','false');if(navToggle)navToggle.textContent='☰'}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){navMenu?.classList.remove('open');closePalette()}});

  const updateProgress=()=>{if(!progress)return;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'};
  addEventListener('scroll',updateProgress,{passive:true});updateProgress();

  const revealEls=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -40px'});revealEls.forEach(el=>io.observe(el))}else revealEls.forEach(el=>el.classList.add('is-visible'));

  const filterButtons=[...document.querySelectorAll('[data-project-filter]')];
  const cards=[...document.querySelectorAll('[data-project-card]')];
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{const filter=btn.dataset.projectFilter;filterButtons.forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});cards.forEach(card=>{const cats=(card.dataset.projectCategory||'').split(/\s+/);card.hidden=filter!=='all'&&!cats.includes(filter)})}));

  const palette=document.getElementById('commandBackdrop');
  const paletteOpen=document.getElementById('paletteOpen');
  const paletteClose=document.getElementById('paletteClose');
  function openPalette(){if(!palette)return;palette.hidden=false;document.body.style.overflow='hidden';palette.querySelector('a')?.focus()}
  function closePalette(){if(!palette)return;palette.hidden=true;document.body.style.overflow=''}
  paletteOpen?.addEventListener('click',openPalette);paletteClose?.addEventListener('click',closePalette);palette?.addEventListener('click',e=>{if(e.target===palette)closePalette()});palette?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closePalette));
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();palette?.hidden?openPalette():closePalette()}});
});