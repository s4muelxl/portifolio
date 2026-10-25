export function initPrefetch() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const canPrefetch = !connection?.saveData && !/^(slow-2g|2g)$/.test(connection?.effectiveType || '');
  if (canPrefetch) {
    const target = location.pathname.includes('projetos') ? 'index.html' : 'projetos.html';
    const prefetch = () => {
      if (document.querySelector('link[data-portfolio-prefetch]')) return;
      const link = document.createElement('link');
      link.rel = 'prefetch'; link.href = target; link.as = 'document'; link.dataset.portfolioPrefetch = '';
      document.head.append(link);
    };
    if ('requestIdleCallback' in window) requestIdleCallback(prefetch,{timeout:1800});
    else setTimeout(prefetch,1200);
  }

}
