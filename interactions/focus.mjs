/** Isolate content behind an overlay without changing its visual layout. */
export function setInert(elements, value) {
  const extras = document.querySelectorAll('.portfolio-build-note, .back-to-top, .skip-link');
  for (const element of new Set([...elements, ...extras])) {
    if (element instanceof HTMLElement) element.inert = value;
  }
}

export function trapFocus(event, elements) {
    const focusable = elements.filter(element => element instanceof HTMLElement
      && element.getClientRects().length && !element.closest('[inert],[hidden]')
      && !element.matches(':disabled'));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !focusable.includes(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
}

