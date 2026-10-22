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

  navToggle?.addEventListener('click',()=>navMenu?.classList.contains('open')?closeNav(true):openNav());
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

  const img=(src,caption,width,height)=>({src,caption,width,height});
  const galleryConfigs={
    nexo:{
      title:'NEXO',
      mobile:{images:[
        img('assets/gallery/nexo-01-home-v3.png','Início · visão do dia e NEXO Score',1170,2532),
        img('assets/gallery/nexo-02-today-v3.png','Hoje · treino do dia, atalhos e seus números',1170,2532),
        img('assets/gallery/nexo-03-workout-v3.png','Treino · sessão, frequência semanal e descanso',1170,2532),
        img('assets/gallery/nexo-04-routine-v3.png','Rotina · agenda, compromissos e checklist',1170,2532),
        img('assets/gallery/nexo-05-meals-v3.png','Refeições · plano alimentar e registros',1170,2532),
        img('assets/gallery/nexo-06-finances-v3.png','Finanças · saldo, receitas, despesas e dívidas',1170,2532),
        img('assets/gallery/nexo-07-investments-v3.png','Investimentos · carteira e desempenho',1170,2532),
        img('assets/gallery/nexo-08-notifications-v3.png','Central NEXO · notificações e prioridades',1170,2532),
        img('assets/gallery/nexo-09-avatar-v3.png','Avatares · personalização do perfil',1170,2532),
        img('assets/gallery/nexo-10-exercise-v3.png','Execução · guia visual de exercício',1170,2532),
        img('assets/gallery/nexo-11-insights-v3.png','Insights · evolução do score',1170,2532),
        img('assets/gallery/nexo-12-analytics-v3.png','Análises · volume, músculos e nutrição',1170,2532),
        img('assets/gallery/nexo-13-agent-v3.png','NEXO Agent · contexto entre dados pessoais',1170,2532)
      ]}
    },
    cbc:{
      title:'Cabeça de Gelo',
      desktop:{images:[
        img('assets/gallery/cbc-desktop-01-home-v3.png','Home desktop · entrada e criação de sala',1613,928),
        img('assets/gallery/cbc-desktop-02-create-room-v3.png','Criar sala · modal desktop',1547,785),
        img('assets/gallery/cbc-desktop-03-room-created-v3.png','Sala criada · código, convite e senha owner',1438,840),
        img('assets/gallery/cbc-desktop-04-stage-v3.png','Palco desktop · canais, mídia e membros',1568,938),
        img('assets/gallery/cbc-desktop-05-share-v3.png','Compartilhamento de tela · fluxo em execução',1556,942)
      ]},
      mobile:{images:[
        img('assets/gallery/cbc-mobile-01-home-dark-v3.png','Home mobile · tema escuro',1170,2532),
        img('assets/gallery/cbc-mobile-02-home-light-v3.png','Home mobile · tema claro',1170,2532),
        img('assets/gallery/cbc-mobile-03-create-room-v3.png','Criar sala · formulário mobile',1170,2532),
        img('assets/gallery/cbc-mobile-04-room-created-v3.png','Sala criada · credenciais e convite',1170,2532),
        img('assets/gallery/cbc-mobile-05-stage-light-v3.png','Palco · tema claro',1170,2532),
        img('assets/gallery/cbc-mobile-06-stage-dark-v3.png','Palco · tema escuro',1170,2532),
        img('assets/gallery/cbc-mobile-07-chat-v3.png','Chat da sala',1170,2532),
        img('assets/gallery/cbc-mobile-08-members-v3.png','Membros da sala',1170,2532),
        img('assets/gallery/cbc-mobile-09-channels-v3.png','Canais de voz',1170,2532)
      ]}
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

  const openLightbox=(carousel,item)=>{
    if(!mediaLightbox||!lightboxStage||!item) return;
    lightboxPreviousFocus=document.activeElement;
    const type=carousel.dataset.carousel;
    const mode=carousel.dataset.mode||'mobile';
    const project=galleryConfigs[type]?.title||'Projeto';
    mediaLightbox.hidden=false;
    mediaLightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    lightboxStage.classList.toggle('is-phone',mode==='mobile');
    lightboxStage.style.aspectRatio=`${item.width} / ${item.height}`;
    const image=document.createElement('img');
    image.className='gallery-image lightbox-image';
    image.src=item.src;
    image.alt=item.caption;
    image.width=item.width;
    image.height=item.height;
    image.decoding='async';
    lightboxStage.appendChild(image);
    if(lightboxTitle) lightboxTitle.textContent=project+' · '+(mode==='mobile'?'Mobile':'Desktop');
    if(lightboxCaption) lightboxCaption.textContent=item.caption;
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
    const preload=(src)=>{const p=new Image(); p.decoding='async'; p.src=src;};

    const render=()=>{
      const config=getConfig();
      const count=config.images.length;
      index=((index%count)+count)%count;
      const item=config.images[index];
      carousel.dataset.mode=mode;
      carousel.dataset.count=String(count);
      if(frame){
        frame.src=item.src;
        frame.alt=item.caption;
        frame.width=item.width;
        frame.height=item.height;
        frame.decoding='async';
      }
      if(viewport){
        viewport.classList.toggle('gallery-phone',mode==='mobile');
        viewport.classList.toggle('gallery-desktop',mode!=='mobile');
        viewport.style.aspectRatio=`${item.width} / ${item.height}`;
        viewport.setAttribute('aria-label','Ampliar '+galleryConfigs[type].title+' — '+item.caption);
      }
      if(countEl) countEl.textContent=String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');
      if(captionEl) captionEl.textContent=item.caption;
      if(progressEl) progressEl.style.width=((index+1)/count*100)+'%';
      modeButtons.forEach(btn=>{
        const active=btn.dataset.galleryMode===mode;
        btn.classList.toggle('active',active);
        btn.setAttribute('aria-pressed',String(active));
      });
      requestAnimationFrame(()=>{
        preload(config.images[(index+1)%count].src);
        preload(config.images[(index-1+count)%count].src);
      });
    };

    const move=delta=>{index+=delta;render()};
    prev?.addEventListener('click',()=>move(-1));
    next?.addEventListener('click',()=>move(1));
    modeButtons.forEach(btn=>btn.addEventListener('click',()=>{mode=btn.dataset.galleryMode||mode;index=0;render();}));
    carousel.addEventListener('keydown',event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}
      if(event.key==='ArrowRight'){event.preventDefault();move(1)}
    });
    viewport?.addEventListener('pointerdown',event=>{pointerStartX=event.clientX;pointerStartY=event.clientY;});
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
      openLightbox(carousel,config.images[index]);
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