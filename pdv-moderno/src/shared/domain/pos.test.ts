import test from "node:test";
import assert from "node:assert/strict";

import {
  applyDiscount,
  calculateCartSummary,
  filterProducts,
  formatCurrency,
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

test("calculateCartSummary totals quantity, weight and subtotal from mock cart items", () => {
  const summary = calculateCartSummary([
    { product: products[0], quantity: 2 },
    { product: products[1], quantity: 1.25 },
    { product: products[2], quantity: 1 },
  ]);

  assert.equal(summary.itemCount, 4.25);
  assert.equal(summary.weightKg, 1.25);
  assert.equal(summary.subtotal, 33.4);
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
