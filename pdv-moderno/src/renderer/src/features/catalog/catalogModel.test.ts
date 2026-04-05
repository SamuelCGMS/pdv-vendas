import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyInventoryCount,
  applyManualAdjustment,
  filterCatalogProducts,
  formatStockQuantity,
  getInventoryProducts,
  matchCatalogProducts,
  upsertCatalogProduct,
} from './catalogModel.ts';
import type { CatalogProductRecord } from './types.ts';

const sampleProducts: CatalogProductRecord[] = [
  {
    productId: 'prd-001',
    id: '789100000001',
    barcodes: ['789100000001', '200000000001'],
    name: 'Banana Prata',
    category: 'Hortifruti',
    unit: 'kg',
    price: 7.99,
    costPrice: 5.2,
    suggestedMargin: 53.65,
    saleMode: 'weight',
    stockMinimum: 8,
    stockQuantity: 26,
    updatedAt: '2026-03-29T11:00:00.000Z',
  },
  {
    productId: 'prd-002',
    id: '789100000002',
    barcodes: ['789100000002'],
    name: 'Leite Integral 1L',
    category: 'Laticinios',
    unit: 'un',
    price: 4.99,
    costPrice: 3.49,
    suggestedMargin: 42.98,
    saleMode: 'unit',
    stockMinimum: 12,
    stockQuantity: 18,
    updatedAt: '2026-03-29T11:00:00.000Z',
  },
];

test('upsertCatalogProduct cria produto pesavel com unidade kg e lista unica de codigos', () => {
  const result = upsertCatalogProduct(sampleProducts, {
    productId: null,
    primaryBarcode: '789100000003',
    extraBarcodesText: '200000000003, 200000000004, 200000000003',
    name: 'Queijo Prato Fatiado',
    category: 'Frios',
    unit: 'un',
    costPrice: '29,90',
    salePrice: '39,90',
    suggestedMargin: '0',
    saleMode: 'weight',
    stockMinimum: '4',
  }, 'Helena Costa', '2026-03-29T12:00:00.000Z');

  assert.equal(result.savedProduct?.unit, 'kg');
  assert.equal(result.savedProduct?.id, '789100000003');
  assert.deepEqual(result.savedProduct?.barcodes, ['789100000003', '200000000003', '200000000004']);
  assert.equal(result.savedProduct?.saleMode, 'weight');
});

test('applyManualAdjustment reduz estoque e gera movimentacao rastreavel', () => {
  const result = applyManualAdjustment(sampleProducts, {
    productId: 'prd-002',
    mode: 'decrease',
    quantity: '3',
    reason: 'Avaria na gondola',
    operator: 'Samuel Gomes',
  }, '2026-03-29T12:05:00.000Z');

  const updated = result.products.find((product) => product.productId === 'prd-002');

  assert.equal(updated?.stockQuantity, 15);
  assert.equal(result.movement?.quantityDelta, -3);
  assert.equal(result.movement?.stockBefore, 18);
  assert.equal(result.movement?.stockAfter, 15);
  assert.equal(result.movement?.reason, 'Avaria na gondola');
});

test('applyInventoryCount reconcilia contagens e gera movimentacoes apenas para divergencias', () => {
  const result = applyInventoryCount(sampleProducts, {
    counts: {
      'prd-001': '24',
      'prd-002': '18',
    },
    operator: 'Ana Silva',
    reason: 'Inventario semanal',
  }, '2026-03-29T12:10:00.000Z');

  const banana = result.products.find((product) => product.productId === 'prd-001');
  const leite = result.products.find((product) => product.productId === 'prd-002');

  assert.equal(banana?.stockQuantity, 24);
  assert.equal(leite?.stockQuantity, 18);
  assert.equal(result.movements.length, 1);
  assert.equal(result.movements[0]?.quantityDelta, -2);
  assert.equal(result.movements[0]?.kind, 'inventory');
});

test('upsertCatalogProduct rejeita campos numericos invalidos no cadastro', () => {
  assert.throws(() => {
    upsertCatalogProduct(sampleProducts, {
      productId: null,
      primaryBarcode: '789100000099',
      extraBarcodesText: '',
      name: 'Produto Inválido',
      category: 'Mercearia',
      unit: 'un',
      costPrice: 'abc',
      salePrice: '10,00',
      suggestedMargin: 'x',
      saleMode: 'unit',
      stockMinimum: '1',
    }, 'Helena Costa', '2026-03-29T12:00:00.000Z');
  }, /preço de custo/i);
});

test('applyInventoryCount rejeita contagens invalidas ou negativas', () => {
  assert.throws(() => {
    applyInventoryCount(sampleProducts, {
      counts: {
        'prd-001': '-5',
      },
      operator: 'Ana Silva',
      reason: 'Inventario semanal',
    }, '2026-03-29T12:10:00.000Z');
  }, /não pode ser negativa/i);

  assert.throws(() => {
    applyInventoryCount(sampleProducts, {
      counts: {
        'prd-002': 'abc',
      },
      operator: 'Ana Silva',
      reason: 'Inventario semanal',
    }, '2026-03-29T12:10:00.000Z');
  }, /quantidade válida/i);
});

test('applyManualAdjustment rejeita quantidade fracionaria para produto por unidade', () => {
  assert.throws(() => {
    applyManualAdjustment(sampleProducts, {
      productId: 'prd-002',
      mode: 'increase',
      quantity: '1,6',
      reason: 'Acerto',
      operator: 'Samuel Gomes',
    }, '2026-03-29T12:05:00.000Z');
  }, /inteira/i);
});

test('applyInventoryCount rejeita contagem fracionaria para produto por unidade', () => {
  assert.throws(() => {
    applyInventoryCount(sampleProducts, {
      counts: {
        'prd-002': '1,4',
      },
      operator: 'Ana Silva',
      reason: 'Inventario semanal',
    }, '2026-03-29T12:10:00.000Z');
  }, /inteira/i);
});

test('formatStockQuantity preserva saldo zero e negativo no estoque', () => {
  assert.equal(formatStockQuantity(0, 'un'), '0 un');
  assert.equal(formatStockQuantity(-2, 'un'), '-2 un');
  assert.equal(formatStockQuantity(0, 'kg'), '0,000 kg');
});

test('getInventoryProducts mantem o inventario desacoplado dos filtros de produtos', () => {
  const filteredProducts = filterCatalogProducts(sampleProducts, {
    search: 'banana',
    saleMode: 'all',
    status: 'all',
  });

  const inventoryProducts = getInventoryProducts(sampleProducts);

  assert.equal(filteredProducts.length, 1);
  assert.equal(inventoryProducts.length, 2);
  assert.deepEqual(
    inventoryProducts.map((product) => product.productId),
    ['prd-001', 'prd-002'],
  );
});

test('filterCatalogProducts trata busca com apenas espacos como filtro vazio', () => {
  const filteredProducts = filterCatalogProducts(sampleProducts, {
    search: '   ',
    saleMode: 'all',
    status: 'all',
  });

  assert.equal(filteredProducts.length, sampleProducts.length);
});

test('matchCatalogProducts encontra produto por nome, codigo principal e codigo adicional', () => {
  assert.equal(matchCatalogProducts(sampleProducts, 'banana').length, 1);
  assert.equal(matchCatalogProducts(sampleProducts, '789100000002').length, 1);
  assert.equal(matchCatalogProducts(sampleProducts, '200000000001').length, 1);
});
