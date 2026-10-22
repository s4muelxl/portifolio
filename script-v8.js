document.addEventListener('DOMContentLoaded',()=>{
  const CURRENT_BUILD='20261022f';
  const pageBuild=document.documentElement.dataset.build||'';
  if(pageBuild!==CURRENT_BUILD){
    try{
      const u=new URL(window.location.href);
      u.searchParams.set('rev',CURRENT_BUILD);
      window.location.replace(u.toString());
      return;
    }catch{}
  }

  const navToggle=document.getElementById('navToggle');
  const navMenu=document.getElementById('navMenu');
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
    const firstLink=navMenu.querySelector('.nav-link');
    if(firstLink instanceof HTMLElement) firstLink.focus();
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

  navToggle?.addEventListener('click',()=>navMenu?.classList.contains('open')?closeNav(true):openNav());
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
  }else revealEls.forEach(el=>el.classList.add('is-visible'));

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
        files:[
          'assets/gallery/nexo-01-home-v3.webp',
          'assets/gallery/nexo-02-today-v3.webp',
          'assets/gallery/nexo-03-workout-v3.webp',
          'assets/gallery/nexo-04-routine-v3.webp',
          'assets/gallery/nexo-05-meals-v3.webp',
          'assets/gallery/nexo-06-finances-v3.webp',
          'assets/gallery/nexo-07-investments-v3.webp',
          'assets/gallery/nexo-08-notifications-v3.webp',
          'assets/gallery/nexo-09-avatar-v3.webp',
          'assets/gallery/nexo-10-exercise-v3.webp',
          'assets/gallery/nexo-11-insights-v3.webp',
          'assets/gallery/nexo-12-analytics-v3.webp',
          'assets/gallery/nexo-13-agent-v3.webp'
        ],
        captions:[
          'Início · visão geral e NEXO Score',
          'Início · treino do dia e indicadores',
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
        files:[
          'assets/gallery/cbc-desktop-01-home-v4.webp',
          'assets/gallery/cbc-desktop-02-create-room-v4.webp',
          'assets/gallery/cbc-desktop-03-room-created-v4.webp',
          'assets/gallery/cbc-desktop-04-stage-v4.webp',
          'assets/gallery/cbc-desktop-05-share-v4.webp'
        ],
        captions:[
          'Home desktop · entrada e criação de sala',
          'Criar sala · modal desktop',
          'Sala criada · código, convite e senha owner',
          'Palco desktop · canais, mídia e membros',
          'Compartilhamento de tela · fluxo em execução'
        ]
      },
      mobile:{
        files:[
          'assets/gallery/cbc-mobile-01-home-dark-v3.webp',
          'assets/gallery/cbc-mobile-02-home-light-v3.webp',
          'assets/gallery/cbc-mobile-03-create-room-v3.webp',
          'assets/gallery/cbc-mobile-04-room-created-v3.webp',
          'assets/gallery/cbc-mobile-05-stage-light-v3.webp',
          'assets/gallery/cbc-mobile-06-stage-dark-v3.webp',
          'assets/gallery/cbc-mobile-07-chat-v3.webp',
          'assets/gallery/cbc-mobile-08-members-v4.webp',
          'assets/gallery/cbc-mobile-09-channels-v4.webp'
        ],
        captions:[
          'Home mobile · tema escuro',
          'Home mobile · tema claro',
          'Criar sala · formulário mobile',
          'Sala criada · credenciais e convite',
          'Palco mobile · tema claro',
          'Palco mobile · tema escuro',
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

  const openLightbox=(carousel,frame,caption)=>{
    if(!mediaLightbox||!lightboxStage||!frame) return;
    lightboxPreviousFocus=document.activeElement;
    const type=carousel.dataset.carousel;
    const mode=carousel.dataset.mode||'mobile';
    const project=galleryConfigs[type]?.title||'Projeto';
    mediaLightbox.hidden=false;
    mediaLightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    lightboxStage.classList.toggle('is-phone',mode==='mobile');
    const image=document.createElement('img');
    image.className='lightbox-image';
    image.src=frame.currentSrc||frame.src;
    image.alt=frame.alt||caption||'Screenshot real do projeto';
    image.decoding='async';
    lightboxStage.appendChild(image);
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

    const preloadNeighbors=(config)=>{
      if(!config?.files?.length) return;
      [index-1,index+1].forEach(raw=>{
        const i=(raw+config.files.length)%config.files.length;
        const img=new Image();
        img.src=config.files[i];
      });
    };

    const render=()=>{
      const config=getConfig();
      const count=config.files.length;
      index=((index%count)+count)%count;
      carousel.dataset.mode=mode;
      carousel.dataset.count=String(count);

      if(frame instanceof HTMLImageElement){
        frame.src=config.files[index];
        frame.alt=config.captions[index]||'Screenshot real';
        const dims=type==='nexo'||mode==='mobile'?{w:1170,h:2532}:{w:1613,h:928};
        frame.width=dims.w;
        frame.height=dims.h;
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
      preloadNeighbors(config);
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
      openLightbox(carousel,frame,config.captions[index]);
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