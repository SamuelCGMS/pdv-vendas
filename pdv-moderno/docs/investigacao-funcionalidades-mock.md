# 🔍 Investigação: Funcionalidades Mock a Implementar

> **Status:** Investigação completa — aguardando aprovação para iniciar
> **Data:** 2026-05-04
> **Impacto visual:** ZERO — nenhuma tela muda visualmente

---

## Como vai funcionar

Hoje suas telas são **estáticas** — os dados são hardcoded direto no JSX ou importados como constantes fixas.  
O objetivo é tornar tudo **interativo com dados mock**, sem alterar a aparência.

A ideia central é criar uma **camada de serviços** entre as telas e os dados:

```
HOJE:    Tela → import { dados } from mocks → renderiza estático
DEPOIS:  Tela → useService() → serviço mock → dados reagem a ações do usuário
```

Quando for hora do backend, troca-se `MockService → ApiService`. As telas não mudam.

---

## 📊 Mapa de Funcionalidades por Tela

### 🟢 = Já funciona | 🟡 = Parcial | 🔴 = Não funciona (estático)

---

### APP SALES

#### Tela 1: Abertura de Caixa (`OpeningScreen`)

| Elemento | Estado | O que falta |
|----------|--------|-------------|
| Selecionar operador | 🟢 | Funciona (useState local) |
| Input "Fundo de Troco" | 🔴 | Aceita digitação mas **não armazena** o valor em lugar nenhum |
| Botão "Abrir Caixa" | 🟡 | Muda de tela, mas não registra: operador, fundo de troco, horário de abertura |
| Relógio "08:42 AM" | 🔴 | Horário hardcoded — deveria ser relógio em tempo real |

**Funcionalidades a adicionar:**
1. Relógio em tempo real no header
2. Capturar valor do fundo de troco
3. Registrar sessão de caixa (operador + fundo + hora de abertura) ao clicar "Abrir Caixa"
4. Validar: não permitir abrir caixa sem operador selecionado e fundo > 0

---

#### Tela 2: Tela de Vendas (`SalesScreen` — tela principal)

| Elemento | Estado | O que falta |
|----------|--------|-------------|
| Busca de produto | 🟡 | Filtra, mas só mostra resultados com query > 24 caracteres (bug?) |
| Resultados da busca | 🔴 | Clicou num resultado → **nada acontece** (não adiciona ao carrinho) |
| Carrinho (CartList) | 🔴 | Lista estática de `cartItems` — não reage a nada |
| Botões +/- quantidade | 🔴 | Renderizam mas **sem onClick** |
| "[ESC] Limpar" carrinho | 🔴 | Sem funcionalidade |
| Total "R$ 12,55" | 🔴 | Hardcoded no JSX — não calcula do carrinho |
| Resumo (3 unid, 2.150 kg, Descontos) | 🔴 | Hardcoded — não calcula do carrinho |
| Métodos de pagamento (Cartão/Dinheiro/Pix) | 🔴 | Botões sem estado — "selected" é classe fixa |
| "Finalizar Venda [F12]" | 🟡 | Navega para PaymentScreen, mas não passa os dados reais |
| "Estacionar [F10]" | 🔴 | Sem funcionalidade |
| "Desconto [F11]" | 🟡 | Abre modal, mas modal não aplica desconto |
| Teclas de atalho (F1-F12, ESC) | 🔴 | Nenhum atalho de teclado funciona |
| "F12: Nova Venda" sidebar | 🔴 | Sem funcionalidade |
| "F3: Cancelar Venda" topbar | 🔴 | Sem funcionalidade |
| Nome do operador na topbar | 🔴 | Hardcoded "João Silva" — deveria vir da sessão |

**Funcionalidades a adicionar:**
1. **Carrinho reativo**: estado gerenciado (adicionar, remover, alterar quantidade)
2. **Busca funcional**: corrigir threshold de 24 chars, clique adiciona ao carrinho
3. **Cálculos automáticos**: total, subtotal, contagem, peso — via `calculateCartSummary()`
4. **Seleção de método de pagamento**: estado reativo
5. **Modal de desconto funcional**: aplicar desconto % ou fixo no subtotal
6. **Limpar carrinho**: botão ESC funcional
7. **Nova Venda**: limpar carrinho e recomeçar
8. **Cancelar Venda**: confirmar e limpar tudo
9. **Atalhos de teclado**: F1, F3, F6-F8, F10, F11, F12, ESC
10. **Operador na topbar**: vir da sessão aberta

---

#### Tela 3: Confirmação de Pagamento (`PaymentScreen`)

| Elemento | Estado | O que falta |
|----------|--------|-------------|
| Total a Pagar | 🟡 | Usa `payment.total` mas valor hardcoded (342.50) |
| "5 Itens" | 🔴 | Hardcoded — deveria contar do carrinho |
| Subtotal, Desconto, Total Final | 🔴 | Valores parcialmente hardcoded |
| Seleção de método | 🟢 | Funciona (useState) |
| "Confirmar Pagamento" | 🔴 | **Sem onClick** — não faz nada |
| "Voltar ao Caixa" | 🟢 | Funciona |
| "Pedido #4092" | 🔴 | Hardcoded — deveria ser auto-incremento |
| "Cancelar Venda" header | 🟡 | Volta para sales, mas não limpa nada |

**Funcionalidades a adicionar:**
1. Receber dados reais do carrinho (total, itens, desconto)
2. "Confirmar Pagamento" → registrar venda na sessão → voltar para tela de vendas com carrinho limpo
3. Número do pedido auto-incremento
4. Animação/feedback de "Venda confirmada" (toast ou similar)

---

#### Tela 4: Fechamento de Caixa (`ClosingScreen`)

| Elemento | Estado | O que falta |
|----------|--------|-------------|
| Conferência de valores | 🟡 | Usa `paymentBreakdown` mock, mas deveria ser o acumulado real das vendas da sessão |
| Total Esperado / Apurado | 🟡 | Calcula do mock, não do acumulado real |
| Performance (142 atendimentos, R$29,90 ticket) | 🔴 | Hardcoded |
| Volume por hora (barras) | 🔴 | Alturas fixas — deveria refletir vendas mock |
| "Encerrar Turno" | 🔴 | Sem funcionalidade |
| Comprovante (receipt modal) | 🟡 | Abre/fecha funciona, mas dados hardcoded |

**Funcionalidades a adicionar:**
1. Acumular vendas da sessão e gerar breakdown real
2. Calcular atendimentos e ticket médio da sessão
3. "Encerrar Turno" → resetar sessão → voltar para abertura de caixa
4. Comprovante com dados da sessão real

---

### APP MANAGEMENT

#### Tela 5: Estoque (`InventoryScreen`)

| Elemento | Estado | O que falta |
|----------|--------|-------------|
| Busca local de produtos | 🟢 | Funciona |
| Métricas (1,284 itens / 12 alertas / R$42.190) | 🔴 | Hardcoded — deveria calcular do estoque mock |
| Tabela de produtos | 🟡 | Renderiza do mock mas estoque/preço divergem dos `products` do shared |
| Botão "Filtrar" | 🔴 | Sem funcionalidade |
| Botão "Novo Produto" | 🔴 | Sem funcionalidade |
| Botão "Exportar" | 🔴 | Sem funcionalidade |
| Botão "Ações" (3 pontos) por linha | 🔴 | Sem funcionalidade |
| Paginação | 🔴 | Botões renderizam mas sem funcionalidade |
| "Exibindo 1-4 de 1.284" | 🔴 | Hardcoded |

**Funcionalidades a adicionar:**
1. Métricas calculadas do mock de produtos
2. Filtro por categoria
3. Paginação funcional (dividir produtos em páginas)
4. Botão ações → dropdown com opções (editar, excluir — mock)
5. "Novo Produto" → modal de cadastro mock
6. Estoque compartilhado com Sales (quando vende, estoque diminui)

---

#### Tela 6: Relatórios (`ReportsScreen`)

| Elemento | Estado | O que falta |
|----------|--------|-------------|
| Métricas (R$142.850 / R$384,20 / 1.248) | 🔴 | Hardcoded |
| Donut chart (Vendas por método) | 🔴 | Hardcoded |
| Análise de Performance (Banana Prata, etc.) | 🔴 | Hardcoded |
| Fluxo de Caixa (barras) | 🔴 | Hardcoded |
| Últimas Transações | 🟡 | Usa mock `recentTransactions`, mas não reflete vendas feitas no Sales |
| "Exportar PDF" | 🔴 | Sem funcionalidade |
| "Últimos 30 dias" | 🔴 | Sem funcionalidade |

**Funcionalidades a adicionar:**
1. Métricas calculadas das vendas mock acumuladas
2. Transações refletindo vendas feitas no Sales
3. Filtro de período (sem funcionalidade real, mas reagir ao clique)

---

## 🏗️ Arquitetura Proposta: Camada de Serviços

```
src/shared/
├── services/
│   ├── types.ts              ← Contratos (interfaces)
│   ├── session-service.ts    ← Abertura/fechamento de caixa
│   ├── cart-service.ts       ← Carrinho reativo
│   ├── sale-service.ts       ← Registrar vendas, histórico
│   ├── stock-service.ts      ← Estoque (decrementa ao vender)
│   └── report-service.ts     ← Métricas calculadas
├── hooks/
│   ├── useSession.ts         ← Hook para sessão do caixa
│   ├── useCart.ts             ← Hook para carrinho
│   └── useStore.ts           ← Hook para estado compartilhado
├── store/
│   └── app-store.ts          ← Estado global mock (vendas, estoque, sessão)
```

> [!IMPORTANT]
> Tudo será feito com **React state puro** (`useState` / `useReducer` / Context).
> Nenhuma lib externa é necessária nesta fase — os dados vivem em memória durante a sessão.

---

## 📋 Plano de Implementação (Ordem)

| # | Tarefa | Telas afetadas | Complexidade |
|---|--------|---------------|-------------|
| 1 | Criar `app-store.ts` — estado central mock | Todas | Média |
| 2 | Criar hooks `useSession`, `useCart` | Sales | Média |
| 3 | Abertura de caixa funcional | Opening | Baixa |
| 4 | Carrinho reativo + busca funcional | Sales | **Alta** |
| 5 | Cálculos automáticos (total, peso, desconto) | Sales | Média |
| 6 | Modal de desconto funcional | Sales | Baixa |
| 7 | Atalhos de teclado | Sales | Média |
| 8 | Confirmação de pagamento → registra venda | Payment | Média |
| 9 | Fechamento de caixa com dados da sessão | Closing | Média |
| 10 | Estoque reativo no Management | Inventory | Média |
| 11 | Relatórios com dados das vendas | Reports | Baixa |

---

## ❓ Perguntas Para Você

Antes de começar, preciso que você valide:

### 1. Escopo desta primeira rodada
> Devo implementar **tudo** da tabela acima, ou prefere que eu comece com Sales (itens 1-9) e depois fazemos Management separado?

### 2. Dados compartilhados entre Sales ↔ Management
> Hoje os dois apps rodam em portas separadas (5173 e 5174). Para o mock, cada app terá seu **próprio estado em memória** (ou seja, uma venda feita no Sales NÃO aparece automaticamente no Management). Isso é aceitável por enquanto, ou quer que eu simule a conexão de alguma forma?

### 3. Funcionalidades que ficam de fora agora
> Estou propondo **não** implementar nessas primeira rodada:
> - "Estacionar venda" (F10) — é complexo e não é fluxo principal
> - "Novo Produto" modal no Management — é cadastro, não é fluxo principal  
> - "Exportar PDF" — requer lib externa
> - Paginação real no estoque (pode ficar com mock estático por agora)
> 
> Concorda, ou quer algum desses incluído?

### 4. Algo que eu esqueci?
> Tem alguma funcionalidade que você quer que eu adicione que **não está na lista acima**?
