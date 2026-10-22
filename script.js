document.addEventListener('DOMContentLoaded',()=>{
  const navToggle=document.getElementById('navToggle');
  const navMenu=document.getElementById('navMenu');
  const progress=document.getElementById('scrollProgress');

  const closeNav=()=>{
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded','false');
    if(navToggle) navToggle.textContent='☰';
  };

  navToggle?.addEventListener('click',()=>{
    const open=navMenu?.classList.toggle('open');
    navToggle.setAttribute('aria-expanded',String(Boolean(open)));
    navToggle.textContent=open?'×':'☰';
  });

  navMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeNav));

  const updateProgress=()=>{
    if(!progress) return;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=(max>0?window.scrollY/max*100:0)+'%';
  };
  window.addEventListener('scroll',updateProgress,{passive:true});
  updateProgress();

  const revealEls=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -28px'});
    revealEls.forEach(el=>observer.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add('is-visible'));
  }

  const sections=[...document.querySelectorAll('main section[id]')];
  const links=[...document.querySelectorAll('.nav-link[href^="#"]')];
  if('IntersectionObserver' in window && sections.length && links.length){
    const spy=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible) return;
      links.forEach(link=>{
        const active=link.getAttribute('href')==='#'+visible.target.id;
        link.classList.toggle('active',active);
        if(active) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-28% 0px -62% 0px',threshold:[.01,.2,.4]});
    sections.forEach(section=>spy.observe(section));
  }

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') closeNav();
  });
});