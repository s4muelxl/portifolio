document.addEventListener('DOMContentLoaded',()=>{
  const root=document.documentElement;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('premium-motion');

  const revealTargets=[...document.querySelectorAll('.project-feature,.project-client,.project-row,.case-detail,.skill-block,.cert-card')];
  if('IntersectionObserver' in window&&!reduceMotion){
    revealTargets.forEach(el=>el.dataset.premiumInview='false');
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.dataset.premiumInview='true';
          revealObserver.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -8% 0px'});
    revealTargets.forEach(el=>revealObserver.observe(el));
  }else{
    revealTargets.forEach(el=>el.dataset.premiumInview='true');
  }

  const projectLinks=[...document.querySelectorAll('.project-index a[href^="#"]')];
  const projectTargets=projectLinks
    .map(link=>document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if('IntersectionObserver' in window&&projectLinks.length&&projectTargets.length){
    const projectObserver=new IntersectionObserver(entries=>{
      const active=entries
        .filter(entry=>entry.isIntersecting)
        .sort((a,b)=>Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top))[0];
      if(!active) return;
      projectLinks.forEach(link=>{
        const current=link.getAttribute('href')==='#'+active.target.id;
        if(current) link.setAttribute('aria-current','true');
        else link.removeAttribute('aria-current');
      });
    },{rootMargin:'-22% 0px -58% 0px',threshold:[0,.08,.25]});
    projectTargets.forEach(el=>projectObserver.observe(el));
  }

  if(reduceMotion) return;

  let pointerFrame=0;
  if(window.matchMedia('(pointer:fine)').matches){
    window.addEventListener('pointermove',event=>{
      cancelAnimationFrame(pointerFrame);
      pointerFrame=requestAnimationFrame(()=>{
        root.style.setProperty('--pointer-x',event.clientX+'px');
        root.style.setProperty('--pointer-y',event.clientY+'px');
      });
    },{passive:true});
  }

  const parallaxTargets=[...document.querySelectorAll('.project-feature,.project-client')];
  let scrollFrame=0;
  const updateDepth=()=>{
    scrollFrame=0;
    const vh=window.innerHeight||1;
    parallaxTargets.forEach(section=>{
      const rect=section.getBoundingClientRect();
      if(rect.bottom<0||rect.top>vh) return;
      const center=rect.top+rect.height/2;
      const ratio=(center-vh/2)/vh;
      const shift=Math.max(-12,Math.min(12,ratio*18));
      section.style.setProperty('--premium-shift',shift.toFixed(2)+'px');
    });
  };
  const requestDepth=()=>{
    if(scrollFrame) return;
    scrollFrame=requestAnimationFrame(updateDepth);
  };
  window.addEventListener('scroll',requestDepth,{passive:true});
  window.addEventListener('resize',requestDepth,{passive:true});
  updateDepth();
});
