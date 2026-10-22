document.addEventListener('DOMContentLoaded',()=>{
  const navToggle=document.getElementById('navToggle');
  const navMenu=document.getElementById('navMenu');
  const navClose=document.getElementById('navClose');
  const navBackdrop=document.getElementById('navBackdrop');
  const progress=document.getElementById('scrollProgress');
  let menuTimer=null;
  let menuPreviousFocus=null;

  const openNav=()=>{
    if(!navMenu||!navToggle) return;
    if(menuTimer) clearTimeout(menuTimer);
    menuPreviousFocus=document.activeElement;
    if(navBackdrop){
      navBackdrop.hidden=false;
      requestAnimationFrame(()=>navBackdrop.classList.add('open'));
    }
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded','true');
    document.body.classList.add('menu-open');
    navClose?.focus();
  };

  const closeNav=(restoreFocus=false)=>{
    if(!navMenu||!navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded','false');
    document.body.classList.remove('menu-open');
    navBackdrop?.classList.remove('open');
    menuTimer=setTimeout(()=>{
      if(navBackdrop&&!navMenu.classList.contains('open')) navBackdrop.hidden=true;
    },260);
    if(restoreFocus&&menuPreviousFocus instanceof HTMLElement) menuPreviousFocus.focus();
  };

  navToggle?.addEventListener('click',()=>{
    if(navMenu?.classList.contains('open')) closeNav(true);
    else openNav();
  });
  navClose?.addEventListener('click',()=>closeNav(true));
  navBackdrop?.addEventListener('click',()=>closeNav(true));
  navMenu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeNav(false)));
  window.addEventListener('resize',()=>{if(window.innerWidth>760) closeNav(false)},{passive:true});

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
    },{threshold:.07,rootMargin:'0px 0px -24px'});
    revealEls.forEach(el=>observer.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add('is-visible'));
  }

  const sections=[...document.querySelectorAll('main section[id]')];
  const links=[...document.querySelectorAll('.nav-link[href^="#"]')];
  if('IntersectionObserver' in window&&sections.length&&links.length){
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

  const galleryConfigs={
    nexo:{
      title:'NEXO',
      mobile:{
        count:12,
        sprite:'assets/nexo-mobile-sprite.webp',
        captions:[
          'Início · visão do dia e NEXO Score',
          'Treino · sessão e frequência semanal',
          'Rotina · agenda e checklist diário',
          'Refeições · plano alimentar e registros',
          'Finanças · saldo, receitas, despesas e dívidas',
          'Investimentos · carteira e desempenho',
          'Central NEXO · notificações e prioridades',
          'Avatares · personalização do perfil',
          'Execução · guia visual de exercício',
          'Insights · evolução do score',
          'Análises · volume, músculos e nutrição',
          'NEXO Agent · contexto entre dados pessoais'
        ]
      }
    },
    cbc:{
      title:'Cabeça de Gelo',
      desktop:{
        count:5,
        sprite:'assets/cbc-desktop-sprite.webp',
        captions:[
          'Home desktop · entrada e criação de sala',
          'Criar sala · modal desktop',
          'Sala criada · código, convite e senha owner',
          'Palco desktop · canais, mídia e membros',
          'Compartilhamento de tela · fluxo em execução'
        ]
      },
      mobile:{
        count:8,
        sprite:'assets/cbc-mobile-sprite.webp',
        captions:[
          'Home mobile · tema escuro',
          'Home mobile · tema claro',
          'Criar sala · formulário mobile',
          'Sala criada · credenciais e convite',
          'Palco · interface mobile',
          'Chat da sala',
          'Membros da sala',
          'Canais de voz'
        ]
      }
    }
  };

  const mediaLightbox=document.getElementById('mediaLightbox');
  const lightboxBackdrop=document.getElementById('lightboxBackdrop');
  const lightboxClose=document.getElementById('lightboxClose');
  const lightboxStage=document.getElementById('lightboxStage');
  const lightboxTitle=document.getElementById('lightboxTitle');
  const lightboxCaption=document.getElementById('lightboxCaption');
  let lightboxPreviousFocus=null;

  const closeLightbox=()=>{
    if(!mediaLightbox) return;
    mediaLightbox.hidden=true;
    mediaLightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    if(lightboxStage) lightboxStage.innerHTML='';
    if(lightboxPreviousFocus instanceof HTMLElement) lightboxPreviousFocus.focus();
  };

  const openLightbox=(carousel,frame,viewport,caption)=>{
    if(!mediaLightbox||!lightboxStage||!frame) return;
    lightboxPreviousFocus=document.activeElement;
    const type=carousel.dataset.carousel;
    const mode=carousel.dataset.mode||'mobile';
    const project=galleryConfigs[type]?.title||'Projeto';
    mediaLightbox.hidden=false;
    mediaLightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    lightboxStage.classList.toggle('is-phone',mode==='mobile');
    const sprite=document.createElement('span');
    sprite.className='gallery-sprite';
    sprite.style.backgroundImage=frame.style.backgroundImage;
    sprite.style.backgroundSize=frame.style.backgroundSize;
    sprite.style.backgroundPosition=frame.style.backgroundPosition;
    lightboxStage.appendChild(sprite);
    if(lightboxTitle) lightboxTitle.textContent=project+' · '+(mode==='mobile'?'Mobile':'Desktop');
    if(lightboxCaption) lightboxCaption.textContent=caption||'Screenshot real do projeto';
    lightboxClose?.focus();
  };

  lightboxClose?.addEventListener('click',closeLightbox);
  lightboxBackdrop?.addEventListener('click',closeLightbox);

  document.querySelectorAll('[data-carousel]').forEach(carousel=>{
    const type=carousel.dataset.carousel;
    if(!galleryConfigs[type]) return;
    const frame=carousel.querySelector('[data-carousel-frame]');
    const viewport=carousel.querySelector('[data-carousel-open]');
    const countEl=carousel.querySelector('[data-carousel-count]');
    const captionEl=carousel.querySelector('[data-carousel-caption]');
    const progressEl=carousel.querySelector('[data-carousel-progress]');
    const prev=carousel.querySelector('[data-carousel-prev]');
    const next=carousel.querySelector('[data-carousel-next]');
    const modeButtons=[...carousel.querySelectorAll('[data-gallery-mode]')];
    let index=0;
    let mode=carousel.dataset.mode||'mobile';
    let pointerStartX=0;
    let pointerStartY=0;
    let lastSwipeAt=0;

    const getConfig=()=>galleryConfigs[type][mode]||galleryConfigs[type].mobile||galleryConfigs[type].desktop;

    const render=()=>{
      const config=getConfig();
      const count=config.count;
      index=((index%count)+count)%count;
      carousel.dataset.mode=mode;
      carousel.dataset.count=String(count);
      if(frame){
        frame.dataset.sprite=config.sprite;
        frame.style.backgroundImage='url("'+config.sprite+'")';
        frame.style.backgroundSize=(count*100)+'% 100%';
        frame.style.backgroundPosition=(count<=1?0:(index/(count-1))*100)+'% center';
      }
      if(viewport){
        viewport.classList.toggle('gallery-phone',mode==='mobile');
        viewport.classList.toggle('gallery-desktop',mode!=='mobile');
        viewport.setAttribute('aria-label','Ampliar '+galleryConfigs[type].title+' — '+config.captions[index]);
      }
      if(countEl) countEl.textContent=String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');
      if(captionEl) captionEl.textContent=config.captions[index]||'Screenshot real';
      if(progressEl) progressEl.style.width=((index+1)/count*100)+'%';
      modeButtons.forEach(btn=>{
        const active=btn.dataset.galleryMode===mode;
        btn.classList.toggle('active',active);
        btn.setAttribute('aria-pressed',String(active));
      });
    };

    const move=delta=>{index+=delta;render()};
    prev?.addEventListener('click',()=>move(-1));
    next?.addEventListener('click',()=>move(1));

    modeButtons.forEach(btn=>btn.addEventListener('click',()=>{
      mode=btn.dataset.galleryMode||mode;
      index=0;
      render();
    }));

    carousel.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}
      if(event.key==='ArrowRight'){event.preventDefault();move(1)}
    });

    viewport?.addEventListener('pointerdown',event=>{
      pointerStartX=event.clientX;
      pointerStartY=event.clientY;
    });
    viewport?.addEventListener('pointerup',event=>{
      const dx=event.clientX-pointerStartX;
      const dy=event.clientY-pointerStartY;
      if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)){
        lastSwipeAt=Date.now();
        move(dx<0?1:-1);
      }
    });
    viewport?.addEventListener('click',event=>{
      if(Date.now()-lastSwipeAt<350){event.preventDefault();return}
      const config=getConfig();
      openLightbox(carousel,frame,viewport,config.captions[index]);
    });

    render();
  });

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      if(mediaLightbox&&!mediaLightbox.hidden){closeLightbox();return}
      closeNav(true);
      return;
    }

    if(event.key==='Tab'&&navMenu?.classList.contains('open')){
      const focusables=[...navMenu.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.offsetParent!==null);
      if(!focusables.length) return;
      const first=focusables[0],last=focusables[focusables.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
});