import {MAX_ITEMS, calculateReceipt, formatMoney, formatQuantity, receiptText} from './receipt-core.mjs?v=20261023c';

export function initReceiptDemos() {
  document.querySelectorAll('[data-receipt-demo]').forEach(root => {
    if (root.dataset.initialized === 'true') return;
    const form = root.querySelector('form');
    const list = root.querySelector('[data-demo-items]');
    const template = root.querySelector('template');
    const error = root.querySelector('[data-demo-error]');
    const status = root.querySelector('[data-demo-status]');
    const preview = root.querySelector('[data-demo-preview-items]');
    const total = root.querySelector('[data-demo-total]');
    const download = root.querySelector('[data-demo-download]');
    const add = root.querySelector('[data-demo-add]');
    const fallback = root.querySelector('[data-demo-fallback]');
    const enhanced = root.querySelector('[data-demo-enhanced]');
    const previewClient = root.querySelector('[data-demo-client]');
    const previewPayment = root.querySelector('[data-demo-payment]');
    const previewState = root.querySelector('[data-demo-preview-state]');
    if (!(form instanceof HTMLFormElement) || !(template instanceof HTMLTemplateElement)
        || !template.content.firstElementChild || !list || !error || !status || !preview
        || !total || !download || !add || !fallback || !enhanced
        || !previewClient || !previewPayment || !previewState) return;
    const client = form.elements.namedItem('client');
    const payment = form.elements.namedItem('payment');
    if (!(client instanceof HTMLInputElement) || !(payment instanceof HTMLSelectElement)) return;
    root.dataset.initialized = 'true';
    let lastReceipt = null;
    let downloadUrl = null;

    const rows = () => [...list.querySelectorAll('[data-demo-item]')];
    const readItems = () => rows().map(row => ({
      description: row.querySelector('[name="description"]').value,
      quantity: row.querySelector('[name="quantity"]').value,
      price: row.querySelector('[name="price"]').value
    }));
    const syncControls = () => {
      const all = rows();
      add.disabled = all.length >= MAX_ITEMS;
      all.forEach((row, index) => {
        row.querySelector('[data-demo-remove]').disabled = all.length === 1;
        row.querySelector('[data-demo-remove]').setAttribute('aria-label', `Remover item ${index + 1}`);
        row.querySelector('[data-item-number]').textContent = String(index + 1).padStart(2, '0');
      });
    };

    const update = (showError = false) => {
      syncControls();
      try {
        const receipt = calculateReceipt(readItems());
        const fragment = document.createDocumentFragment();
        receipt.items.forEach(item => {
          const line = document.createElement('div');
          line.className = 'receipt-item';
          const description = document.createElement('span');
          description.textContent = `${formatQuantity(item.quantity)}× ${item.description}`;
          const subtotal = document.createElement('strong');
          subtotal.textContent = formatMoney(item.subtotal);
          line.append(description, subtotal);
          fragment.appendChild(line);
        });
        preview.replaceChildren(fragment);
        total.textContent = formatMoney(receipt.total);
        previewClient.textContent = client.value.trim() || 'Consumidor Final';
        previewPayment.textContent = payment.value;
        error.hidden = true;
        error.textContent = '';
        download.disabled = false;
        root.dataset.state = 'valid';
        previewState.textContent = 'Prévia atualizada';
        lastReceipt = receipt;
        return true;
      } catch (exception) {
        download.disabled = true;
        root.dataset.state = 'invalid';
        previewState.textContent = 'Confira os campos para atualizar';
        lastReceipt = null;
        if (showError) {
          error.textContent = exception.message;
          error.hidden = false;
        } else if (!error.hidden) error.textContent = exception.message;
        return false;
      }
    };

    form.addEventListener('input', () => { status.textContent = ''; update(); });
    form.addEventListener('change', () => update());
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (update(true)) status.textContent = 'Recibo atualizado. Você pode baixar o arquivo de texto.';
      else error.focus({preventScroll: true});
    });
    form.addEventListener('focusout', event => {
      if (event.target.matches('[name="description"],[name="quantity"],[name="price"]')) update(true);
    });
    add.addEventListener('click', () => {
      if (rows().length >= MAX_ITEMS) return;
      const row = template.content.firstElementChild.cloneNode(true);
      list.appendChild(row);
      syncControls();
      update();
      row.querySelector('input').focus({preventScroll: true});
      status.textContent = 'Item adicionado. Preencha a descrição, a quantidade e o preço.';
    });
    list.addEventListener('click', event => {
      const button = event.target.closest('[data-demo-remove]');
      if (!button || rows().length <= 1) return;
      const row = button.closest('[data-demo-item]');
      const target = row.nextElementSibling || row.previousElementSibling;
      row.remove();
      update(true);
      target?.querySelector('input').focus({preventScroll: true});
      status.textContent = 'Item removido. Total atualizado.';
    });
    download.addEventListener('click', () => {
      if (!update(true) || !lastReceipt) return;
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      const text = receiptText({client: client.value, payment: payment.value, receipt: lastReceipt});
      downloadUrl = URL.createObjectURL(new Blob([text], {type: 'text/plain;charset=utf-8'}));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'recibo-demonstracao-samuel-alves.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      status.textContent = 'Arquivo de texto preparado para download.';
    });
    window.addEventListener('pagehide', () => { if (downloadUrl) URL.revokeObjectURL(downloadUrl); });

    if (update()) {
      form.hidden = false;
      fallback.hidden = true;
      enhanced.hidden = false;
    }
  });
}
