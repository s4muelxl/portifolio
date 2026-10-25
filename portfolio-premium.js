import {initReveals} from './interactions/reveal.mjs';
import {initCertificates} from './interactions/certificates.mjs';

if (/Instagram|FBAN|FBAV|FB_IAB/i.test(navigator.userAgent || '')) {
  document.documentElement.classList.add('in-app-browser');
}

// Optional enhancements cannot interrupt each other or the main navigation.
for (const initialize of [initCertificates, initReveals]) {
  try {
    initialize();
  } catch (error) {
    console.error('Não foi possível iniciar um aprimoramento visual.', error);
    document.querySelectorAll('.reveal-pending').forEach(element => {
      element.classList.remove('reveal-pending');
    });
  }
}
