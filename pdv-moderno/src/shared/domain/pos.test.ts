import test from "node:test";
import assert from "node:assert/strict";

import {
  applyDiscount,
  calculateCartSummary,
  calculateHourlySalesVolume,
  createSessionHourLabels,
  filterProducts,
  formatCurrency,
  parseCashFund,
  sanitizeCashFundInput,
  type Product,
} from "./pos.ts";

const products: Product[] = [
  { id: "avocado", name: "Abacate Hass", code: "LL-FR-001", category: "Frutas", unit: "un", price: 2.25 },
  { id: "tomato", name: "Tomate Heirloom", code: "LL-VG-042", category: "Vegetais", unit: "kg", price: 18.4 },
  { id: "spinach", name: "Couve Organica", code: "LL-VG-021", category: "Vegetais", unit: "un", price: 5.9 },
];

test("formatCurrency returns Brazilian currency without losing cents", () => {
  assert.equal(formatCurrency(342.5), "R$ 342,50");
});

test("calculateCartSummary counts cart lines, weight and subtotal from mock cart items", () => {
  const summary = calculateCartSummary([
    { product: products[0], quantity: 2 },
    { product: products[1], quantity: 1.25 },
    { product: products[2], quantity: 1 },
  ]);

  assert.equal(summary.itemCount, 3);
  assert.equal(summary.weightKg, 1.25);
  assert.equal(summary.subtotal, 33.4);
});

test("parseCashFund only accepts positive money values", () => {
  assert.equal(parseCashFund("125,50"), 125.5);
  assert.equal(parseCashFund("0"), null);
  assert.equal(parseCashFund(""), null);
  assert.equal(parseCashFund("abc"), null);
});

test("sanitizeCashFundInput keeps only a positive money shape and reports invalid attempts", () => {
  assert.deepEqual(sanitizeCashFundInput("12a3"), {
    value: "123",
    error: "Use apenas numeros e separador decimal.",
  });
  assert.deepEqual(sanitizeCashFundInput("-10"), {
    value: "10",
    error: "O fundo de troco precisa ser positivo.",
  });
  assert.deepEqual(sanitizeCashFundInput("12,345"), {
    value: "12,34",
    error: null,
  });
});

test("applyDiscount supports subtotal percentage discounts", () => {
  const discounted = applyDiscount(360, { type: "percentage", value: 5 });

  assert.deepEqual(discounted, {
    discountAmount: 18,
    total: 342,
  });
});

test("filterProducts matches by name, code and category without accents being required", () => {
  assert.deepEqual(
    filterProducts(products, "vegetais").map((product) => product.id),
    ["tomato", "spinach"],
  );

  assert.deepEqual(
    filterProducts(products, "organica").map((product) => product.id),
    ["spinach"],
  );

  assert.deepEqual(
    filterProducts(products, "ll-fr").map((product) => product.id),
    ["avocado"],
  );
});

test("calculateHourlySalesVolume groups sales by local hour and scales bar heights", () => {
  const sales = [
    { completedAt: new Date("2026-05-04T08:15:00"), total: 10 },
    { completedAt: new Date("2026-05-04T11:00:00"), total: 50 },
    { completedAt: new Date("2026-05-04T11:30:00"), total: 150 },
  ];

  assert.deepEqual(calculateHourlySalesVolume(sales, ["08h", "09h", "11h"]), [
    { hour: "08h", total: 10, heightPercent: 10 },
    { hour: "09h", total: 0, heightPercent: 6 },
    { hour: "11h", total: 200, heightPercent: 100 },
  ]);
});

test("createSessionHourLabels covers every hour from opening through closing", () => {
  assert.deepEqual(
    createSessionHourLabels(new Date("2026-05-04T08:15:00"), new Date("2026-05-04T11:05:00")),
    ["08h", "09h", "10h", "11h"],
  );

  assert.deepEqual(
    createSessionHourLabels(new Date("2026-05-04T23:30:00"), new Date("2026-05-05T01:10:00")),
    ["23h", "00h", "01h"],
  );
});
