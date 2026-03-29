import { formatCurrency, formatQuantity } from '../../../../shared/sales.ts';
import { getStockStatus } from './catalogModel.ts';
import CatalogProductModal from './CatalogProductModal.tsx';
import type { CatalogController } from './useCatalogController.ts';
import type { AdjustmentMode, CatalogProductRecord, StockMovement } from './types.ts';

const STATUS_META = {
  normal: {
    label: 'Saudável',
    backgroundColor: 'rgba(25, 128, 56, 0.12)',
    color: 'var(--success)',
  },
  low: {
    label: 'Baixo',
    backgroundColor: 'rgba(241, 194, 27, 0.18)',
    color: '#8A6A00',
  },
  out: {
    label: 'Zerado',
    backgroundColor: 'rgba(218, 30, 40, 0.12)',
    color: 'var(--danger)',
  },
  negative: {
    label: 'Negativo',
    backgroundColor: 'rgba(141, 96, 255, 0.12)',
    color: '#5B3FD2',
  },
} satisfies Record<string, { label: string; backgroundColor: string; color: string }>;

const NOTICE_META = {
  info: {
    borderColor: 'var(--primary)',
    backgroundColor: 'rgba(15, 98, 254, 0.08)',
  },
  success: {
    borderColor: 'var(--success)',
    backgroundColor: 'rgba(25, 128, 56, 0.08)',
  },
  warning: {
    borderColor: 'var(--warning)',
    backgroundColor: 'rgba(241, 194, 27, 0.14)',
  },
  danger: {
    borderColor: 'var(--danger)',
    backgroundColor: 'rgba(218, 30, 40, 0.08)',
  },
} satisfies Record<string, { borderColor: string; backgroundColor: string }>;

const MOVEMENT_KIND_LABEL = {
  catalog: 'Cadastro',
  adjustment: 'Ajuste manual',
  inventory: 'Inventário',
} satisfies Record<StockMovement['kind'], string>;

function parseNumericInput(rawValue: string): number | null {
  const value = rawValue.trim();

  if (!value) {
    return null;
  }

  return Number(value.replace(',', '.'));
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function getInventoryDelta(product: CatalogProductRecord, counts: Record<string, string>): number | null {
  const countedValue = parseNumericInput(counts[product.productId] ?? '');

  if (countedValue === null || !Number.isFinite(countedValue)) {
    return null;
  }

  return Number((countedValue - product.stockQuantity).toFixed(3));
}

function renderStatusBadge(product: CatalogProductRecord) {
  const status = getStockStatus(product);
  const meta = STATUS_META[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        padding: '6px 10px',
        borderRadius: '999px',
        backgroundColor: meta.backgroundColor,
        color: meta.color,
        fontWeight: 700,
        fontSize: '0.8rem',
      }}
    >
      {meta.label}
    </span>
  );
}

function ProductTable({ controller }: { controller: CatalogController }) {
  return (
    <div className="card glass flex-col" style={{ padding: '24px', gap: '20px' }}>
      <div className="flex justify-between items-center gap-4" style={{ flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.7fr) repeat(2, minmax(180px, 0.8fr))', gap: '12px', flex: 1 }}>
          <input
            style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
            placeholder="Buscar por nome, categoria ou código"
            value={controller.productSearch}
            onChange={(event) => controller.handleProductSearchChange(event.target.value)}
          />
          <select
            style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
            value={controller.statusFilter}
            onChange={(event) => controller.handleStatusFilterChange(event.target.value as typeof controller.statusFilter)}
          >
            <option value="all">Todos os status</option>
            <option value="normal">Saudável</option>
            <option value="low">Baixo</option>
            <option value="out">Zerado</option>
            <option value="negative">Negativo</option>
          </select>
          <select
            style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
            value={controller.productModeFilter}
            onChange={(event) => controller.handleProductModeFilterChange(event.target.value as typeof controller.productModeFilter)}
          >
            <option value="all">Todos os modos</option>
            <option value="unit">Por unidade</option>
            <option value="weight">Pesável</option>
          </select>
        </div>

        <button className="btn btn-primary" type="button" onClick={controller.handleOpenNewProduct}>
          + Novo Produto
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1120px' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Código</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Produto</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Categoria</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Custo</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Venda</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Margem</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Indicador</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Estoque</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {controller.filteredProducts.map((product) => (
              <tr key={product.productId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: 700 }}>
                  <div>{product.id}</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                    +{Math.max(0, product.barcodes.length - 1)} código(s)
                  </div>
                </td>
                <td style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 700 }}>{product.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    mínimo {formatQuantity(product.stockMinimum, product.unit)}
                  </div>
                </td>
                <td style={{ padding: '14px' }}>{product.category}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>R$ {formatCurrency(product.costPrice)}</td>
                <td style={{ padding: '14px', textAlign: 'right', color: 'var(--success)', fontWeight: 700 }}>
                  R$ {formatCurrency(product.price)}
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>{product.suggestedMargin.toFixed(2).replace('.', ',')}%</td>
                <td style={{ padding: '14px', textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      backgroundColor: product.saleMode === 'weight' ? 'rgba(25, 128, 56, 0.12)' : 'rgba(15, 98, 254, 0.12)',
                      color: product.saleMode === 'weight' ? 'var(--success)' : 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {product.saleMode === 'weight' ? 'Pesável' : `Unidade / ${product.unit.toUpperCase()}`}
                  </span>
                </td>
                <td style={{ padding: '14px', textAlign: 'center', fontWeight: 700 }}>
                  {formatQuantity(product.stockQuantity, product.unit)}
                </td>
                <td style={{ padding: '14px', textAlign: 'center' }}>{renderStatusBadge(product)}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-outline" type="button" onClick={() => controller.handleOpenEditProduct(product)}>
                      Editar
                    </button>
                    <button className="btn btn-outline" type="button" onClick={() => controller.handleOpenInventoryForProduct(product)}>
                      Inventário
                    </button>
                    <button className="btn btn-outline" type="button" onClick={() => controller.handleOpenAdjustmentForProduct(product)}>
                      Ajustar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {controller.filteredProducts.length === 0 && (
        <div
          className="card"
          style={{ padding: '32px', textAlign: 'center', backgroundColor: 'var(--surface-100)', color: 'var(--text-secondary)' }}
        >
          Nenhum produto encontrado com os filtros atuais.
        </div>
      )}
    </div>
  );
}

function MovementsTable({ controller }: { controller: CatalogController }) {
  return (
    <div className="card glass flex-col" style={{ padding: '24px', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.6fr) minmax(220px, 0.7fr)', gap: '12px' }}>
        <input
          style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
          placeholder="Buscar por produto, motivo ou operador"
          value={controller.movementSearch}
          onChange={(event) => controller.handleMovementSearchChange(event.target.value)}
        />
        <select
          style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
          value={controller.movementKindFilter}
          onChange={(event) => controller.handleMovementKindFilterChange(event.target.value as typeof controller.movementKindFilter)}
        >
          <option value="all">Todos os movimentos</option>
          <option value="catalog">Cadastro</option>
          <option value="adjustment">Ajuste manual</option>
          <option value="inventory">Inventário</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Quando</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Produto</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Tipo</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Delta</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Antes</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Depois</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Motivo</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Operador</th>
            </tr>
          </thead>
          <tbody>
            {controller.filteredMovements.map((movement) => (
              <tr key={movement.movementId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '14px', fontWeight: 600 }}>{formatTimestamp(movement.createdAt)}</td>
                <td style={{ padding: '14px' }}>{movement.productName}</td>
                <td style={{ padding: '14px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      padding: '6px 10px',
                      borderRadius: '999px',
                      backgroundColor: 'var(--surface-200)',
                      fontWeight: 700,
                    }}
                  >
                    {MOVEMENT_KIND_LABEL[movement.kind]}
                  </span>
                </td>
                <td
                  style={{
                    padding: '14px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: movement.quantityDelta >= 0 ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {movement.quantityDelta > 0 ? '+' : ''}
                  {movement.quantityDelta.toFixed(Math.abs(movement.quantityDelta) % 1 === 0 ? 0 : 3).replace('.', ',')}
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>{movement.stockBefore}</td>
                <td style={{ padding: '14px', textAlign: 'right' }}>{movement.stockAfter}</td>
                <td style={{ padding: '14px' }}>{movement.reason}</td>
                <td style={{ padding: '14px' }}>{movement.operator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryPanel({ controller }: { controller: CatalogController }) {
  return (
    <div className="card glass flex-col" style={{ padding: '24px', gap: '20px' }}>
      <div className="flex justify-between items-start gap-4" style={{ flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>Inventário visual</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '720px' }}>
            Digite apenas os itens contados. O sistema compara com o saldo atual e gera movimentação de reconciliação só onde houver divergência.
          </p>
        </div>

        <button className="btn btn-success" type="button" onClick={controller.handleApplyInventory}>
          Aplicar Contagens
        </button>
      </div>

      <textarea
        style={{
          width: '100%',
          minHeight: '74px',
          padding: '14px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          resize: 'vertical',
        }}
        value={controller.inventoryDraft.reason}
        onChange={(event) => controller.handleInventoryReasonChange(event.target.value)}
        placeholder="Motivo / observação do inventário"
      />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '920px' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Produto</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Código</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Saldo atual</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Contado</th>
              <th style={{ padding: '14px', textAlign: 'right' }}>Diferença</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {controller.filteredProducts.map((product) => {
              const delta = getInventoryDelta(product, controller.inventoryDraft.counts);

              return (
                <tr key={product.productId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px', fontWeight: 700 }}>{product.name}</td>
                  <td style={{ padding: '14px', fontFamily: 'monospace' }}>{product.id}</td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>{formatQuantity(product.stockQuantity, product.unit)}</td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <input
                      style={{ width: '120px', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'right' }}
                      value={controller.inventoryDraft.counts[product.productId] ?? ''}
                      onChange={(event) => controller.handleInventoryCountChange(product.productId, event.target.value)}
                      placeholder={product.stockQuantity.toString().replace('.', ',')}
                      inputMode={product.unit === 'kg' ? 'decimal' : 'numeric'}
                    />
                  </td>
                  <td
                    style={{
                      padding: '14px',
                      textAlign: 'right',
                      fontWeight: 700,
                      color: delta === null ? 'var(--text-tertiary)' : delta >= 0 ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    {delta === null ? 'Sem contagem' : `${delta > 0 ? '+' : ''}${delta.toFixed(product.unit === 'kg' ? 3 : 0).replace('.', ',')}`}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>{renderStatusBadge(product)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdjustmentPanel({ controller }: { controller: CatalogController }) {
  const selectedProduct = controller.products.find((product) => product.productId === controller.adjustmentDraft.productId) ?? null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 420px) minmax(0, 1fr)',
        gap: '24px',
      }}
    >
      <div className="card glass flex-col" style={{ padding: '24px', gap: '18px' }}>
        <h3 style={{ fontSize: '1.35rem' }}>Ajuste manual</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Lance correções rápidas de estoque sem depender de backend nesta fase.
        </p>

        <div className="flex-col gap-2">
          <label style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Produto</label>
          <select
            style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
            value={controller.adjustmentDraft.productId}
            onChange={(event) => controller.handleAdjustmentFieldChange('productId', event.target.value)}
          >
            <option value="">Selecione um produto</option>
            {controller.products.toSorted((leftProduct, rightProduct) => leftProduct.name.localeCompare(rightProduct.name)).map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-col gap-2">
          <label style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Tipo de ajuste</label>
          <select
            style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
            value={controller.adjustmentDraft.mode}
            onChange={(event) => controller.handleAdjustmentFieldChange('mode', event.target.value as AdjustmentMode)}
          >
            <option value="increase">Entrada / acréscimo</option>
            <option value="decrease">Saída / perda</option>
            <option value="set">Definir saldo final</option>
          </select>
        </div>

        <div className="flex-col gap-2">
          <label style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Quantidade</label>
          <input
            style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
            value={controller.adjustmentDraft.quantity}
            onChange={(event) => controller.handleAdjustmentFieldChange('quantity', event.target.value)}
            placeholder="0"
            inputMode="decimal"
          />
        </div>

        <div className="flex-col gap-2">
          <label style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>Motivo</label>
          <textarea
            style={{ minHeight: '88px', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', resize: 'vertical' }}
            value={controller.adjustmentDraft.reason}
            onChange={(event) => controller.handleAdjustmentFieldChange('reason', event.target.value)}
            placeholder="Ex.: avaria, acerto de recebimento, quebra operacional"
          />
        </div>

        <button className="btn btn-primary" type="button" onClick={controller.handleApplyManualAdjustment}>
          Aplicar Ajuste
        </button>
      </div>

      <div className="card glass flex-col" style={{ padding: '24px', gap: '20px' }}>
        <h3 style={{ fontSize: '1.35rem' }}>Pré-visualização</h3>
        {selectedProduct ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              <div className="card" style={{ padding: '18px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Produto</div>
                <div style={{ marginTop: '8px', fontWeight: 700 }}>{selectedProduct.name}</div>
              </div>
              <div className="card" style={{ padding: '18px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Saldo atual</div>
                <div style={{ marginTop: '8px', fontWeight: 700 }}>{formatQuantity(selectedProduct.stockQuantity, selectedProduct.unit)}</div>
              </div>
              <div className="card" style={{ padding: '18px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Indicador</div>
                <div style={{ marginTop: '8px', fontWeight: 700 }}>
                  {selectedProduct.saleMode === 'weight' ? 'Pesável' : 'Por unidade'}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '20px', backgroundColor: 'var(--surface-100)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Resultado esperado
              </div>
              <div style={{ marginTop: '10px', fontSize: '1.6rem', fontWeight: 700 }}>
                {controller.adjustmentDraft.mode === 'set'
                  ? 'Definir novo saldo final'
                  : controller.adjustmentDraft.mode === 'increase'
                    ? 'Somar ao saldo atual'
                    : 'Subtrair do saldo atual'}
              </div>
              <div style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>
                Operador: {controller.adjustmentDraft.operator}
              </div>
            </div>
          </>
        ) : (
          <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Selecione um produto para visualizar o saldo atual antes do ajuste.
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogWorkspace({ controller }: { controller: CatalogController }) {
  const activeNotice = controller.notice ? NOTICE_META[controller.notice.tone] : null;

  return (
    <div className="flex-col h-full w-full" style={{ padding: '28px 32px', overflowY: 'auto', gap: '24px' }}>
      <div className="flex justify-between items-start gap-4" style={{ flexWrap: 'wrap' }}>
        <div>
          <div style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.82rem' }}>
            Estoque / Catálogo / Produto
          </div>
          <h1 style={{ marginTop: '8px', fontSize: '2.2rem' }}>Módulo Visual de Estoque</h1>
          <p style={{ marginTop: '10px', color: 'var(--text-secondary)', maxWidth: '860px' }}>
            Cadastro completo de produto, movimentação, inventário e ajuste manual usando dados mock agora, prontos para plugar no backend depois.
          </p>
        </div>

        <button className="btn btn-primary" type="button" onClick={controller.handleOpenNewProduct}>
          + Novo Produto
        </button>
      </div>

      {controller.notice && activeNotice && (
        <div
          className="card"
          style={{
            padding: '18px 20px',
            borderLeft: `4px solid ${activeNotice.borderColor}`,
            backgroundColor: activeNotice.backgroundColor,
          }}
        >
          <div className="flex justify-between items-start gap-4">
            <div>
              <div style={{ fontWeight: 700 }}>{controller.notice.title}</div>
              <div style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>{controller.notice.message}</div>
            </div>
            <button className="btn btn-outline" type="button" onClick={controller.handleClearNotice}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="card glass" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Produtos ativos</div>
          <div style={{ marginTop: '8px', fontSize: '2rem', fontWeight: 800 }}>{controller.summary.totalProducts}</div>
        </div>
        <div className="card glass" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Baixo / zerado / negativo</div>
          <div style={{ marginTop: '8px', fontSize: '2rem', fontWeight: 800 }}>
            {controller.summary.lowStock} / {controller.summary.outOfStock} / {controller.summary.negativeStock}
          </div>
        </div>
        <div className="card glass" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Valor a custo</div>
          <div style={{ marginTop: '8px', fontSize: '2rem', fontWeight: 800 }}>
            R$ {formatCurrency(controller.summary.inventoryCost)}
          </div>
        </div>
        <div className="card glass" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Valor potencial de venda</div>
          <div style={{ marginTop: '8px', fontSize: '2rem', fontWeight: 800 }}>
            R$ {formatCurrency(controller.summary.inventoryRevenue)}
          </div>
        </div>
      </div>

      <div className="card glass" style={{ padding: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'products', label: 'Produtos' },
          { id: 'movements', label: 'Movimentações' },
          { id: 'inventory', label: 'Inventário' },
          { id: 'adjustment', label: 'Ajuste Manual' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="btn"
            style={{
              backgroundColor: controller.activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: controller.activeTab === tab.id ? 'var(--text-white)' : 'var(--text-secondary)',
              boxShadow: 'none',
            }}
            onClick={() => controller.handleTabChange(tab.id as typeof controller.activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {controller.activeTab === 'products' ? <ProductTable controller={controller} /> : null}
      {controller.activeTab === 'movements' ? <MovementsTable controller={controller} /> : null}
      {controller.activeTab === 'inventory' ? <InventoryPanel controller={controller} /> : null}
      {controller.activeTab === 'adjustment' ? <AdjustmentPanel controller={controller} /> : null}

      <CatalogProductModal
        draft={controller.productDraft}
        isOpen={controller.isProductModalOpen}
        onChange={controller.handleProductFieldChange}
        onClose={controller.handleCloseProductModal}
        onSave={controller.handleSaveProduct}
      />
    </div>
  );
}
