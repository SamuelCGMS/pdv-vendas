const operatorPalette = [
  { accent: '#0F62FE', surface: '#D0E2FF' },
  { accent: '#198038', surface: '#D9F5DD' },
  { accent: '#8A3FFC', surface: '#E8DAFF' },
  { accent: '#FF832B', surface: '#FFE2CC' },
];

function createAvatarDataUri(name, accent, surface) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${name}">
      <rect width="96" height="96" rx="48" fill="${surface}" />
      <circle cx="48" cy="32" r="16" fill="${accent}" opacity="0.18" />
      <rect x="22" y="50" width="52" height="20" rx="10" fill="${accent}" opacity="0.18" />
      <text x="48" y="56" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" fill="${accent}">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createOperator(id, name, role, palette) {
  return {
    id,
    name,
    role,
    avatar: createAvatarDataUri(name, palette.accent, palette.surface),
  };
}

export const operators = [
  createOperator(1, 'Samuel Gomes', 'Gerente', operatorPalette[0]),
  createOperator(2, 'Ana Silva', 'Caixa', operatorPalette[1]),
  createOperator(3, 'Carlos Rocha', 'Caixa', operatorPalette[2]),
  createOperator(4, 'Helena Costa', 'Caixa', operatorPalette[3]),
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
