import test from 'node:test';
import assert from 'node:assert/strict';
import {parseMoney,parseQuantity,calculateReceipt,formatMoney,receiptText,MAX_ITEMS} from '../receipt-core.mjs';

test('preços aceitam formatos brasileiros e decimais com ponto',()=>{
  for(const [input,expected] of [['29,90',2990],['29.90',2990],['R$ 1.234,56',123456],[' r$ 0,01 ',1],['0',0],['999999,99',99999999]]) assert.equal(parseMoney(input),expected);
});
test('preços rejeitam entradas negativas, não finitas, ambíguas e acima do limite',()=>{
  for(const input of ['', '-1', 'NaN','Infinity','1e3','1.234','1,234.56','12abc','1000000','9'.repeat(100)]) assert.throws(()=>parseMoney(input),input);
});
test('quantidades fracionadas são preservadas em milésimos',()=>{
  for(const [input,expected] of [['2',2000],['0,5',500],['0.001',1],['9999',9999000]]) assert.equal(parseQuantity(input),expected);
  for(const input of ['0','-1','0.0001','10000','']) assert.throws(()=>parseQuantity(input),input);
});
test('o exemplo do portfólio soma exatamente R$ 169,70',()=>{
  const receipt=calculateReceipt([{description:'Camiseta Algodão',quantity:'2',price:'59,90'},{description:'Boné Aba Reta',quantity:'1',price:'49,90'}]);
  assert.equal(receipt.total,16970);
  assert.deepEqual(receipt.items.map(item=>item.subtotal),[11980,4990]);
});
test('cálculo monetário mantém centavos exatos e arredonda cada linha',()=>{
  assert.equal(calculateReceipt([{description:'Produto',quantity:'0,1',price:'0,20'}]).total,2);
  assert.equal(calculateReceipt([{description:'Produto',quantity:'0,5',price:'0,01'}]).total,1);
  const items=Array.from({length:MAX_ITEMS},()=>({description:'Produto',quantity:'1',price:'0,10'}));
  assert.equal(calculateReceipt(items).total,120);
});
test('itens precisam de descrição e a demonstração respeita seus limites',()=>{
  const valid={description:'Produto',quantity:'1',price:'10'};
  assert.throws(()=>calculateReceipt([]));
  assert.throws(()=>calculateReceipt(Array.from({length:MAX_ITEMS+1},()=>valid)));
  assert.throws(()=>calculateReceipt([{...valid,description:' '}]))
  assert.throws(()=>calculateReceipt([{...valid,description:'a'.repeat(71)}]));
});
test('a exportação conserva acentos, valores e identifica a demonstração',()=>{
  const receipt=calculateReceipt([{description:'Serviço técnico',quantity:'1,5',price:'10,50'}]);
  const text=receiptText({client:'João',payment:'Crédito',receipt,date:new Date('2026-10-23T12:00:00Z')});
  assert.match(text,/DEMONSTRAÇÃO/);
  assert.match(text,/João/);assert.match(text,/Crédito/);assert.match(text,/Serviço técnico/);
  assert.ok(text.includes(formatMoney(1575)));
  assert.match(text,/Projeto original em Python/);
  assert.match(receiptText({receipt}),/Consumidor Final/);
  assert.equal(Buffer.from(text,'utf8').toString('utf8'),text);
});
