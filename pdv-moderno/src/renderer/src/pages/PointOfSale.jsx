import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ToastViewport from '../components/ToastViewport';
import CashManagement from './CashManagement';
import Catalog from './Catalog';
import HistoricalReports from './HistoricalReports';
import Reports from './Reports';
import Settings from './Settings';
import SalesModals from '../features/sales/SalesModals';
import SalesWorkspace from '../features/sales/SalesWorkspace';
import { usePointOfSaleController } from '../features/sales/usePointOfSaleController';
import { useCatalogController } from '../features/catalog/useCatalogController.ts';

export default function PointOfSale({ operator, runtime, onLogout }) {
  const [activeTab, setActiveTab] = useState('vendas');
  const catalogController = useCatalogController(operator.name);
  const salesController = usePointOfSaleController({
    catalogProducts: catalogController.salesCatalogProducts,
    operator,
    isSalesTabActive: activeTab === 'vendas',
  });

  return (
    <div className="flex h-full w-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <div
        className="flex-col w-full"
        style={{
          backgroundColor: 'var(--surface-200)',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <Header operator={operator} runtime={runtime} />

        {activeTab === 'vendas' && <SalesWorkspace controller={salesController} />}
        {activeTab === 'relatorios' && (
          <Reports operator={operator} shiftSales={salesController.shiftSales} />
        )}
        {activeTab === 'historico' && (
          <HistoricalReports operator={operator} shiftSales={salesController.shiftSales} />
        )}
        {activeTab === 'catalogo' && <Catalog controller={catalogController} />}
        {activeTab === 'caixa' && (
          <CashManagement
            operator={operator}
            shiftSales={salesController.shiftSales}
            movements={salesController.movements}
            onAddMovement={salesController.handleAddMovement}
            onCloseRegister={onLogout}
          />
        )}
        {activeTab === 'configuracoes' && <Settings />}

        <SalesModals controller={salesController} />
        <ToastViewport items={salesController.toasts} onDismiss={salesController.dismissToast} />
      </div>
    </div>
  );
}
