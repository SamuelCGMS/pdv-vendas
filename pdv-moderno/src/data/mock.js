export const operators = [
  { id: 1, name: 'Samuel Gomes', role: 'Gerente', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel' },
  { id: 2, name: 'Ana Silva', role: 'Caixa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana' },
  { id: 3, name: 'Carlos Rocha', role: 'Caixa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos' },
  { id: 4, name: 'Helena Costa', role: 'Caixa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Helena' },
];

export const products = [
  { id: '7891010101010', name: 'Arroz Branco 5kg', price: 23.90, unit: 'un', category: 'Mercearia' },
  { id: '7891010101011', name: 'Feijão Carioca 1kg', price: 7.50, unit: 'un', category: 'Mercearia' },
  { id: '7891010101012', name: 'Maçã Gala', price: 9.90, unit: 'kg', category: 'Hortifruti' },
  { id: '7891010101013', name: 'Banana Prata', price: 6.99, unit: 'kg', category: 'Hortifruti' },
  { id: '7891010101014', name: 'Leite Integral 1L', price: 4.59, unit: 'un', category: 'Laticínios' },
  { id: '7891010101015', name: 'Café Torrado 500g', price: 15.90, unit: 'un', category: 'Mercearia' },
  { id: '7891010101016', name: 'Pão de Forma', price: 8.49, unit: 'un', category: 'Padaria' },
  { id: '7891010101017', name: 'Refrigerante Cola 2L', price: 8.90, unit: 'un', category: 'Bebidas' },
  { id: '7891010101018', name: 'Tomate Italiano', price: 8.49, unit: 'kg', category: 'Hortifruti' },
  { id: '7891010101019', name: 'Queijo Minas Frescal', price: 39.90, unit: 'kg', category: 'Laticínios' },
  { id: '7891010101020', name: 'Uva Itália', price: 12.90, unit: 'kg', category: 'Hortifruti' },
];

// Transações mockadas
export const recentTransactions = [
  { id: 'TRX-1010', time: '14:20', total: 45.90, operator: 'Ana Silva', items: 5 },
  { id: 'TRX-1011', time: '14:25', total: 112.50, operator: 'Ana Silva', items: 12 },
  { id: 'TRX-1012', time: '14:32', total: 15.49, operator: 'Carlos Rocha', items: 2 },
];
