import {initNavigation} from './interactions/navigation.mjs';
import {initReadingPosition} from './interactions/reading-position.mjs';
import {initContact} from './interactions/contact.mjs';
import {initPrefetch} from './interactions/prefetch.mjs';

for (const eventName of ['pageswap', 'pagereveal']) {
  window.addEventListener(eventName, event => {
    const transition = event.viewTransition;
    if (!transition) return;
    transition.ready.catch(() => {});
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) transition.skipTransition();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let galleries = null;
  const navigation = initNavigation({canOpen: () => !galleries?.isOpen()});
  import('./interactions/galleries.mjs')
    .then(({initGalleries}) => { galleries = initGalleries({closeNavigation: () => navigation.close(false)}); })
    .catch(error => console.error('Galerias interativas indisponíveis.', error));
  for (const initialize of [initReadingPosition, initContact, initPrefetch]) {
    try { initialize(); }
    catch (error) { console.error('Não foi possível iniciar uma interação opcional.', error); }
  }
});
