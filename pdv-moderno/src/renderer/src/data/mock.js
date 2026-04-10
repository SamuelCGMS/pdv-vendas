const operatorPalette = [
  { accent: '#0F62FE', surface: '#D0E2FF' },
  { accent: '#198038', surface: '#D9F5DD' },
  { accent: '#8A3FFC', surface: '#E8DAFF' },
  { accent: '#FF832B', surface: '#FFE2CC' },
];

export const workstations = [
  { id: 'cx-01', name: 'Caixa 01', zone: 'Frente principal' },
  { id: 'cx-02', name: 'Caixa 02', zone: 'Saida lateral' },
  { id: 'cx-03', name: 'Caixa 03', zone: 'Atendimento rapido' },
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

function getWorkstation(workstationId) {
  return workstations.find((workstation) => workstation.id === workstationId) ?? workstations[0];
}

function createOperator(id, name, role, palette, workstationId) {
  return {
    id,
    name,
    role,
    avatar: createAvatarDataUri(name, palette.accent, palette.surface),
    workstation: getWorkstation(workstationId),
  };
}

export const operators = [
  createOperator(1, 'Samuel Gomes', 'Gerente', operatorPalette[0], 'cx-03'),
  createOperator(2, 'Ana Silva', 'Caixa', operatorPalette[1], 'cx-01'),
  createOperator(3, 'Carlos Rocha', 'Caixa', operatorPalette[2], 'cx-02'),
  createOperator(4, 'Helena Costa', 'Caixa', operatorPalette[3], 'cx-01'),
];

export const products = [
  { id: '7891010101010', name: 'Arroz Branco 5kg', price: 23.90, unit: 'un', category: 'Mercearia' },
  { id: '7891010101011', name: 'Feijao Carioca 1kg', price: 7.50, unit: 'un', category: 'Mercearia' },
  { id: '7891010101012', name: 'Maca Gala', price: 9.90, unit: 'kg', category: 'Hortifruti' },
  { id: '7891010101013', name: 'Banana Prata', price: 6.99, unit: 'kg', category: 'Hortifruti' },
  { id: '7891010101014', name: 'Leite Integral 1L', price: 4.59, unit: 'un', category: 'Laticinios' },
  { id: '7891010101015', name: 'Cafe Torrado 500g', price: 15.90, unit: 'un', category: 'Mercearia' },
  { id: '7891010101016', name: 'Pao de Forma', price: 8.49, unit: 'un', category: 'Padaria' },
  { id: '7891010101017', name: 'Refrigerante Cola 2L', price: 8.90, unit: 'un', category: 'Bebidas' },
  { id: '7891010101018', name: 'Tomate Italiano', price: 8.49, unit: 'kg', category: 'Hortifruti' },
  { id: '7891010101019', name: 'Queijo Minas Frescal', price: 39.90, unit: 'kg', category: 'Laticinios' },
  { id: '7891010101020', name: 'Uva Italia', price: 12.90, unit: 'kg', category: 'Hortifruti' },
];

export const operationalTransactions = [
  {
    id: 'OP-2001',
    items: 11,
    operatorId: 2,
    operatorName: 'Ana Silva',
    time: '08:12',
    total: 148.2,
    workstationId: 'cx-01',
    workstationName: 'Caixa 01',
  },
  {
    id: 'OP-2002',
    items: 8,
    operatorId: 3,
    operatorName: 'Carlos Rocha',
    time: '08:21',
    total: 94.6,
    workstationId: 'cx-02',
    workstationName: 'Caixa 02',
  },
  {
    id: 'OP-2003',
    items: 6,
    operatorId: 4,
    operatorName: 'Helena Costa',
    time: '08:37',
    total: 81.3,
    workstationId: 'cx-01',
    workstationName: 'Caixa 01',
  },
  {
    id: 'OP-2004',
    items: 13,
    operatorId: 2,
    operatorName: 'Ana Silva',
    time: '09:05',
    total: 176.4,
    workstationId: 'cx-02',
    workstationName: 'Caixa 02',
  },
  {
    id: 'OP-2005',
    items: 16,
    operatorId: 1,
    operatorName: 'Samuel Gomes',
    time: '09:32',
    total: 212.8,
    workstationId: 'cx-03',
    workstationName: 'Caixa 03',
  },
  {
    id: 'OP-2006',
    items: 10,
    operatorId: 3,
    operatorName: 'Carlos Rocha',
    time: '10:08',
    total: 119.9,
    workstationId: 'cx-02',
    workstationName: 'Caixa 02',
  },
  {
    id: 'OP-2007',
    items: 9,
    operatorId: 4,
    operatorName: 'Helena Costa',
    time: '10:26',
    total: 137.5,
    workstationId: 'cx-01',
    workstationName: 'Caixa 01',
  },
  {
    id: 'OP-2008',
    items: 7,
    operatorId: 2,
    operatorName: 'Ana Silva',
    time: '10:44',
    total: 88.7,
    workstationId: 'cx-01',
    workstationName: 'Caixa 01',
  },
];

export const recentTransactions = operationalTransactions
  .slice(-3)
  .reverse()
  .map((transaction) => ({
    id: transaction.id,
    items: transaction.items,
    operator: transaction.operatorName,
    time: transaction.time,
    total: transaction.total,
    workstationName: transaction.workstationName,
  }));
