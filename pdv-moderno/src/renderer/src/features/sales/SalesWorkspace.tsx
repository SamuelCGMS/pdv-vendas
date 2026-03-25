import { memo } from 'react';
import SaleCartPanel from './SaleCartPanel';
import SaleSearchPanel from './SaleSearchPanel';
import SaleSummaryPanel from './SaleSummaryPanel';
import type { PointOfSaleController } from './types';

interface SalesWorkspaceProps {
  controller: PointOfSaleController;
}

function SalesWorkspaceComponent({ controller }: SalesWorkspaceProps) {
  return (
    <div
      className="flex w-full"
      style={{ height: 'calc(100vh - 64px)', padding: '16px', gap: '16px' }}
    >
      <div
        className="flex-col w-full card glass"
        style={{
          flex: 2,
          padding: '32px',
          gap: '24px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          borderTop: '4px solid var(--primary)',
        }}
      >
        <SaleSearchPanel
          barcodeInput={controller.barcodeInput}
          highlightedProductIndex={controller.highlightedProductIndex}
          filteredProducts={controller.filteredProducts}
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
