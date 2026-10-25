// The optional demo has its own entry point so it cannot block navigation.
import('./receipt-demo.mjs?v=20261025a')
  .then(({initReceiptDemos}) => initReceiptDemos())
  .catch(error => console.error('Demonstração de recibos indisponível.', error));
