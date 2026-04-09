import { memo } from 'react';
import { useViewportSize } from '../../hooks/useViewportSize.ts';
import SaleCartPanel from './SaleCartPanel';
import { getSalesLayoutProfile } from './salesLayout.ts';
import SaleSearchPanel from './SaleSearchPanel';
import SaleSummaryPanel from './SaleSummaryPanel';
import type { PointOfSaleController } from './types';

interface SalesWorkspaceProps {
  controller: PointOfSaleController;
}

function SalesWorkspaceComponent({ controller }: SalesWorkspaceProps) {
  const viewport = useViewportSize();
  const layout = getSalesLayoutProfile(viewport);

  return (
    <div
      className="flex w-full"
      style={{
        height: 'calc(100vh - 64px)',
        padding: `${layout.workspacePadding}px`,
        gap: `${layout.workspaceGap}px`,
        flexDirection: layout.workspaceMode === 'stacked' ? 'column' : 'row',
        overflow: 'hidden',
      }}
    >
      <div
        className="flex-col w-full card glass"
        style={{
          flex: 1,
          minWidth: 0,
          padding: `${layout.mainPanelPadding}px`,
          gap: `${layout.mainPanelGap}px`,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          borderTop: '4px solid var(--primary)',
        }}
      >
        <SaleSearchPanel
          barcodeInput={controller.barcodeInput}
          highlightedProductIndex={controller.highlightedProductIndex}
          filteredProducts={controller.filteredProducts}
          layout={layout}
          parsedQuantity={controller.parsedQuantity}
          scaleConnected={controller.scaleConnected}
          searchInputRef={controller.searchInputRef}
          showDropdown={controller.showDropdown}
          onBarcodeChange={controller.handleBarcodeChange}
          onBarcodeSubmit={controller.handleBarcodeSubmit}
          onCloseDropdown={controller.handleCloseDropdown}
          onHighlightProduct={controller.handleSelectHighlightedProduct}
          onOpenDropdown={controller.handleOpenDropdown}
          onSelectProduct={controller.handleProductSelect}
        />

        <SaleCartPanel
          cart={controller.cart}
          layout={layout}
          selectedCartId={controller.selectedCartId}
          onEditItem={controller.handleOpenCartItemEditor}
          onRemoveItem={controller.handleRemoveItem}
          onSelectItem={controller.handleSelectCartItem}
        />
      </div>

      <SaleSummaryPanel
        customerCpf={controller.customerCpf}
        hasCartItems={controller.cart.length > 0}
        hasSelectedCartItem={Boolean(controller.selectedCartItem)}
        layout={layout}
        parkedSalesCount={controller.parkedSales.length}
        summary={controller.saleSummary}
        onConfirmCancelSale={controller.handleOpenCancelSaleConfirm}
        onOpenCpf={controller.handleOpenCpfModal}
        onOpenParkedSales={controller.handleOpenParkedModal}
        onOpenPayment={controller.handleOpenPaymentModal}
        onOpenSaleDiscount={controller.handleOpenSaleDiscountModal}
        onOpenSelectedItemEditor={controller.handleOpenSelectedItemEditor}
        onOpenShortcuts={controller.handleOpenShortcutsModal}
        onParkCurrentSale={controller.handleParkCurrentSale}
      />
    </div>
  );
}

export default memo(SalesWorkspaceComponent);
