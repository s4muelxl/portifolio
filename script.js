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

  navMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));

  const updateProgress=()=>{
    if(!progress) return;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
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
    },{threshold:.08,rootMargin:'0px 0px -35px'});
    revealEls.forEach(el=>observer.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add('is-visible'));
  }

  const sections=[...document.querySelectorAll('main section[id]')];
  const navLinks=[...document.querySelectorAll('.nav-link[href^="#"]')];
  if('IntersectionObserver' in window && sections.length && navLinks.length){
    const spy=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible) return;
      navLinks.forEach(link=>{
        const active=link.getAttribute('href')==='#'+visible.target.id;
        link.classList.toggle('active',active);
        if(active) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-28% 0px -60% 0px',threshold:[.01,.2,.4]});
    sections.forEach(section=>spy.observe(section));
  }

  const filterButtons=[...document.querySelectorAll('[data-project-filter]')];
  const cards=[...document.querySelectorAll('[data-project-card]')];
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.projectFilter||'all';
    filterButtons.forEach(button=>{
      const active=button===btn;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    cards.forEach(card=>{
      const categories=(card.dataset.projectCategory||'').split(/\s+/).filter(Boolean);
      card.hidden=filter!=='all'&&!categories.includes(filter);
    });
  }));

  const palette=document.getElementById('commandBackdrop');
  const paletteOpen=document.getElementById('paletteOpen');
  const paletteClose=document.getElementById('paletteClose');
  const openPalette=()=>{
    if(!palette) return;
    palette.hidden=false;
    document.body.style.overflow='hidden';
    palette.querySelector('a')?.focus();
  };
  const closePalette=()=>{
    if(!palette) return;
    palette.hidden=true;
    document.body.style.overflow='';
  };
  paletteOpen?.addEventListener('click',openPalette);
  paletteClose?.addEventListener('click',closePalette);
  palette?.addEventListener('click',e=>{if(e.target===palette) closePalette()});
  palette?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closePalette));

  const lightbox=document.getElementById('lightbox');
  const lightboxImage=document.getElementById('lightboxImage');
  const lightboxClose=document.getElementById('lightboxClose');

  const openLightbox=(source,alt)=>{
    if(!lightbox||!lightboxImage||!source) return;
    lightboxImage.src=source;
    lightboxImage.alt=alt||'Screenshot ampliado do projeto';
    lightbox.hidden=false;
    document.body.style.overflow='hidden';
    lightboxClose?.focus();
  };
  const closeLightbox=()=>{
    if(!lightbox||!lightboxImage) return;
    lightbox.hidden=true;
    lightboxImage.src='';
    document.body.style.overflow='';
  };

  document.querySelectorAll('[data-lightbox-src]').forEach(button=>{
    button.addEventListener('click',()=>openLightbox(button.dataset.lightboxSrc,button.dataset.lightboxAlt));
  });
  lightboxClose?.addEventListener('click',closeLightbox);
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox) closeLightbox()});

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      closeNav();
      closePalette();
      closeLightbox();
    }
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
      e.preventDefault();
      if(palette?.hidden) openPalette();
      else closePalette();
    }
  });
});