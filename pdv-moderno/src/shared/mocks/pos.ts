import type { CartItem, Product } from "@shared/domain/pos";

export type Operator = {
  id: string;
  name: string;
  role: string;
  image: string;
  selected?: boolean;
};

export const operators: Operator[] = [
  { id: "elena", name: "Elena Rocha", role: "Gerente Sênior", image: "/ui-assets/operators/elena.png", selected: true },
  { id: "lucas", name: "Lucas Mendes", role: "Atendente", image: "/ui-assets/operators/lucas.png" },
  { id: "beatriz", name: "Beatriz Lima", role: "Supervisor de Inventário", image: "/ui-assets/operators/beatriz.png" },
  { id: "thiago", name: "Thiago Silva", role: "Atendente", image: "/ui-assets/operators/thiago.png" },
];

export const products: Product[] = [
  {
    id: "avocado-hass",
    name: "Hass Avocados",
    code: "LL-FR-001",
    category: "Frutas",
    unit: "un",
    price: 2.25,
    stock: 142,
    image: "/ui-assets/products/hass-avocados.png",
  },
  {
    id: "purple-grapes",
    name: "Purple Grapes",
    code: "LL-FR-028",
    category: "Frutas",
    unit: "kg",
    price: 6.9,
    stock: 36,
    image: "/ui-assets/products/purple-grapes.png",
  },
  {
    id: "organic-spinach",
    name: "Organic Spinach",
    code: "LL-VG-021",
    category: "Vegetais",
    unit: "un",
    price: 3.1,
    stock: 56,
    image: "/ui-assets/products/organic-spinach.png",
  },
  {
    id: "tomato-heirloom",
    name: "Tomate Heirloom",
    code: "LL-VG-042",
    category: "Vegetais",
    unit: "kg",
    price: 12.9,
    stock: 84,
    image: "/ui-assets/products/tomate-heirloom.png",
  },
  {
    id: "couve-organica",
    name: "Couve Orgânica",
    code: "LL-VG-001",
    category: "Vegetais",
    unit: "un",
    price: 4.5,
    stock: 160,
    image: "/ui-assets/products/couve-organica.png",
  },
  {
    id: "mel-manuka",
    name: "Mel de Manuka Floral",
    code: "LL-PN-210",
    category: "Despensa",
    unit: "un",
    price: 184,
    stock: 12,
    image: "/ui-assets/products/mel-manuka.png",
  },
  {
    id: "mix-folhas",
    name: "Mix de Folhas Baby",
    code: "LL-VG-015",
    category: "Vegetais",
    unit: "pct",
    price: 8.5,
    stock: 142,
    image: "/ui-assets/products/mix-folhas.png",
  },
];

export const cartItems: CartItem[] = [
  { product: products[0], quantity: 2 },
  { product: products[1], quantity: 1 },
  { product: products[2], quantity: 2 },
];

export const paymentBreakdown = [
  { label: "Dinheiro", value: 850 },
  { label: "Cartão de Crédito", value: 1200 },
  { label: "Cartão de Débito", value: 900 },
  { label: "Pix", value: 1150 },
  { label: "Vale Alimentação", value: 80 },
  { label: "Ticket Refeição", value: 70 },
];

export const recentTransactions = [
  { customer: "João Silva", date: "Hoje, 14:32", status: "Pago", value: 1240 },
  { customer: "Maria Almeida", date: "Hoje, 12:15", status: "Pago", value: 450.2 },
  { customer: "Ricardo Costa", date: "Ontem, 18:40", status: "Pendente", value: 2890 },
];
