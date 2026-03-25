import { memo } from 'react';
import type { DiscountDefinition } from '../../../../shared/sales';
import CpfModal from '../../components/CpfModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import ParkedSalesModal from '../../components/ParkedSalesModal';
import PaymentModal from '../../components/PaymentModal';
import ReceiptModal from '../../components/ReceiptModal';
import SaleDiscountModal from '../../components/SaleDiscountModal';
import SaleItemEditorModal from '../../components/SaleItemEditorModal';
import ScaleWeighModal from '../../components/ScaleWeighModal';
import ShortcutHelpModal from '../../components/ShortcutHelpModal';
import { saleShortcuts } from './saleShortcuts';
import type { PointOfSaleController } from './types';

interface SalesModalsProps {
  controller: PointOfSaleController;
}

function SalesModalsComponent({ controller }: SalesModalsProps) {
  return (
    <>
      {controller.showCpfModal && (
        <CpfModal
          currentCpf={controller.customerCpf}
          onConfirm={controller.handleConfirmCpf}
          onCancel={controller.handleCloseCpfModal}
        />
      )}

      {controller.showPaymentModal && (
        <PaymentModal
          total={controller.saleSummary.total}
          onCancel={controller.handleClosePaymentModal}
          onConfirm={controller.handlePaymentConfirm}
        />
      )}

      {controller.completedSaleData && (
        <ReceiptModal
          data={controller.completedSaleData}
          onPrint={controller.handleReceiptPrint}
          onClose={controller.handleReceiptClose}
        />
      )}

      {controller.showWeighModal && controller.pendingWeighProduct && (
        <ScaleWeighModal
          product={controller.pendingWeighProduct}
          onConfirm={controller.handleWeighConfirm}
          onCancel={controller.handleWeighCancel}
        />
      )}

      {controller.showParkedModal && (
        <ParkedSalesModal
          sales={controller.parkedSales}
          onResume={controller.handleResumeParkedSale}
          onClose={controller.handleCloseParkedModal}
        />
      )}

      {controller.showShortcutsModal && (
        <ShortcutHelpModal
          shortcuts={saleShortcuts}
          onClose={controller.handleCloseShortcutsModal}
        />
      )}

      {controller.showSaleDiscountModal && (
        <SaleDiscountModal
          discountBase={controller.saleSummary.discountBase}
          initialDiscount={controller.saleDiscount}
          onConfirm={controller.handleApplySaleDiscount}
          onCancel={controller.handleCloseSaleDiscountModal}
        />
      )}

      {controller.editingCartItem && (
        <SaleItemEditorModal
          item={controller.editingCartItem}
          onConfirm={({ quantity, discount }: { quantity: number; discount: DiscountDefinition }) => {
            controller.handleSaveCartItem(quantity, discount);
          }}
          onCancel={controller.handleCloseCartItemEditor}
        />
      )}

      {controller.showCancelSaleConfirm && (
        <ConfirmDialog
          title="Cancelar compra atual?"
          description="Todos os itens do cupom serão removidos. Use esta ação apenas quando realmente precisar limpar a venda."
          confirmLabel="Cancelar compra"
          cancelLabel="Continuar venda"
          tone="danger"
          onConfirm={controller.handleCancelSale}
          onCancel={controller.handleCloseCancelSaleConfirm}
        />
      )}
    </>
  );
}

export default memo(SalesModalsComponent);
