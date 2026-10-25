/** Copy contact details and report failure without claiming a successful copy. */
export function initContact() {
  const copyEmail = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('#copyStatus');
  if (copyEmail) {
    const originalLabel = copyEmail.textContent;
    copyEmail.addEventListener('click', async () => {
      const value = copyEmail.dataset.copyEmail || '';
      try {
        if (navigator.clipboard?.writeText && window.isSecureContext) await navigator.clipboard.writeText(value);
        else {
          const area = document.createElement('textarea');
          area.value = value; area.setAttribute('readonly',''); area.style.position='fixed'; area.style.opacity='0';
          document.body.append(area);
          try {
            area.select();
            if (!document.execCommand('copy')) throw new Error('Clipboard indisponível');
          } finally {
            area.remove();
            copyEmail.focus({preventScroll: true});
          }
        }
        copyEmail.textContent = 'E-mail copiado ✓';
        copyEmail.classList.add('is-copied');
        if (copyStatus) copyStatus.textContent = 'E-mail copiado para a área de transferência.';
        setTimeout(() => { copyEmail.textContent = originalLabel; copyEmail.classList.remove('is-copied'); }, 1800);
      } catch {
        if (copyStatus) copyStatus.textContent = `Não foi possível copiar. E-mail: ${value}`;
      }
    });
  }

}
