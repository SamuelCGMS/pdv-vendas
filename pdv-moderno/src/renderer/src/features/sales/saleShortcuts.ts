export interface SaleShortcut {
  keys: string;
  label: string;
  description: string;
}

export const saleShortcuts = [
  {
    keys: 'F2',
    label: 'CPF na nota',
    description: 'Abre ou edita o CPF/CNPJ do cliente.',
  },
  {
    keys: 'F3',
    label: 'Editar item',
    description: 'Abre a edição do item selecionado ou do último item lançado.',
  },
  {
    keys: 'F4',
    label: 'Estacionar',
    description: 'Coloca a venda atual em espera.',
  },
  {
    keys: 'F5',
    label: 'Ver esperas',
    description: 'Abre a lista das vendas estacionadas.',
  },
  {
    keys: 'F6 ou F1',
    label: 'Atalhos',
    description: 'Mostra este guia rápido de teclado.',
  },
  {
    keys: 'F7',
    label: 'Desconto na venda',
    description: 'Aplica ou remove desconto sobre o total da venda.',
  },
  {
    keys: 'F9',
    label: 'Pagamento',
    description: 'Abre a tela de recebimento.',
  },
  {
    keys: 'Ctrl + ↑ / Ctrl + ↓',
    label: 'Selecionar item',
    description: 'Navega entre os itens do cupom sem tirar o foco da busca.',
  },
  {
    keys: '↑ / ↓',
    label: 'Navegar busca',
    description: 'Move a seleção da lista de produtos filtrados.',
  },
  {
    keys: 'Enter',
    label: 'Inserir / confirmar',
    description: 'Insere o produto selecionado ou confirma o modal ativo.',
  },
  {
    keys: 'Esc',
    label: 'Fechar / cancelar',
    description: 'Fecha lista ou modal aberto e pede confirmação para cancelar a compra.',
  },
] satisfies ReadonlyArray<SaleShortcut>;
