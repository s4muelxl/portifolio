// Browser demonstration of the original Python CLI's input → calculation → text flow.
export const MAX_ITEMS = 12;

function decimalUnits(value, precision, label) {
  const input = String(value ?? '').trim().replace(/^r\$\s*/i, '');
  let normalized = input;
  if (input.includes(',') && input.includes('.')) {
    if (!/^\d{1,3}(?:\.\d{3})+,\d+$/.test(input)) throw new Error(`${label}: use o formato 1.234,56.`);
    normalized = input.replaceAll('.', '').replace(',', '.');
  } else normalized = input.replace(',', '.');
  const pattern = new RegExp(`^\\d+(?:\\.\\d{1,${precision}})?$`);
  if (!pattern.test(normalized)) throw new Error(`${label}: informe um número válido e positivo.`);
  const [integer, fraction = ''] = normalized.split('.');
  const units = Number(integer) * 10 ** precision + Number(fraction.padEnd(precision, '0'));
  if (!Number.isSafeInteger(units)) throw new Error(`${label}: valor acima do limite da demonstração.`);
  return units;
}

export function parseMoney(value) {
  const cents = decimalUnits(value, 2, 'Preço');
  if (cents > 99_999_999) throw new Error('Preço: máximo de R$ 999.999,99 por unidade.');
  return cents;
}

export function parseQuantity(value) {
  const units = decimalUnits(value, 3, 'Quantidade');
  if (units <= 0 || units > 9_999_000) throw new Error('Quantidade: use um valor entre 0,001 e 9.999.');
  return units;
}

export function formatMoney(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error('Total monetário inválido.');
  return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(cents / 100);
}

export function formatQuantity(milliUnits) {
  return new Intl.NumberFormat('pt-BR', {maximumFractionDigits: 3}).format(milliUnits / 1000);
}

export function calculateReceipt(items) {
  if (!Array.isArray(items) || !items.length || items.length > MAX_ITEMS) throw new Error(`Adicione entre 1 e ${MAX_ITEMS} itens.`);
  const calculated = items.map((item, index) => {
    const description = String(item.description ?? '').trim();
    if (!description || description.length > 70) throw new Error(`Item ${index + 1}: descreva o produto em até 70 caracteres.`);
    const quantity = parseQuantity(item.quantity);
    const unitPrice = parseMoney(item.price);
    // Integer cents and thousandths avoid accumulating floating-point currency errors.
    const subtotal = Math.floor((quantity * unitPrice + 500) / 1000);
    return {description, quantity, unitPrice, subtotal};
  });
  const total = calculated.reduce((sum, item) => sum + item.subtotal, 0);
  if (!Number.isSafeInteger(total)) throw new Error('Total acima do limite da demonstração.');
  return {items: calculated, total};
}

export function receiptText({client, payment, receipt, date = new Date()}) {
  const customer = String(client ?? '').trim().slice(0, 70) || 'Consumidor Final';
  const method = String(payment ?? '').trim().slice(0, 30) || 'Não informado';
  const timestamp = new Intl.DateTimeFormat('pt-BR', {dateStyle: 'short', timeStyle: 'medium'}).format(date);
  return [
    'COMPROVANTE / RECIBO — DEMONSTRAÇÃO',
    `Data: ${timestamp}`, `Cliente: ${customer}`, `Pagamento: ${method}`, '',
    ...receipt.items.map(item => `${formatQuantity(item.quantity)}× ${item.description} — ${formatMoney(item.subtotal)}`),
    '', `VALOR TOTAL: ${formatMoney(receipt.total)}`, '',
    'Demonstração do portfólio de Samuel Alves.',
    'Projeto original em Python: https://github.com/s4muelxl/receipt-generator-py', ''
  ].join('\n');
}
