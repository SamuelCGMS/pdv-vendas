import React, { useEffect, useMemo, useState } from 'react';
import {
  formatCurrency,
  formatQuantity,
  getItemTotal,
  getSaleSummary,
} from '../../../shared/sales';

export default function ReceiptModal({ data, onClose, onPrint }) {
  const [receiptType, setReceiptType] = useState('fiscal'); // 'fiscal', 'nao-fiscal'
  const {
    cart,
    payments,
    total,
    change,
    operator,
    customerCpf,
    summary,
    saleDiscount,
  } = data;

  const saleSummary = useMemo(() => {
    return summary ?? getSaleSummary(cart, saleDiscount ?? null);
  }, [cart, saleDiscount, summary]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    onPrint?.();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="flex-col" style={{ width: '450px', backgroundColor: 'var(--surface-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Header do Modal */}
        <div className="flex justify-between items-center" style={{ padding: '16px 24px', backgroundColor: 'var(--surface-100)', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Emissão de Documento</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>×</button>
        </div>
        
        {/* Seletor de Tipo */}
        <div className="flex" style={{ padding: '16px 24px', gap: '8px', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface-100)' }}>
          <button 
            className={`btn ${receiptType === 'fiscal' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ flex: 1, padding: '12px', fontSize: '1rem',  transition: 'all 0.2s' }}
            onClick={() => setReceiptType('fiscal')}
          >
            NFC-e (Fiscal)
          </button>
          <button 
            className={`btn ${receiptType === 'nao-fiscal' ? 'btn-primary' : 'btn-outline'}`} 
            style={{ flex: 1, padding: '12px', fontSize: '1rem', transition: 'all 0.2s' }}
            onClick={() => setReceiptType('nao-fiscal')}
          >
            Não Fiscal
          </button>
        </div>

        {/* Simulador Físico do Papel Térmico */}
        <div style={{ padding: '24px', backgroundColor: '#e2e2e2', display: 'flex', justifyContent: 'center', height: '500px', overflowY: 'auto' }}>
          
          <div style={{ 
            backgroundColor: '#FFFAED', /* Tom levemente amarelado de papel térmico */
            width: '100%', 
            padding: '24px 16px',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '0.85rem',
            color: '#000',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>GRAVITY MERCADO LTDA</h3>
              {receiptType === 'fiscal' && <div>CNPJ: 00.000.000/0001-00<br/>Avenida Ficticia, 123 - Centro</div>}
              <div style={{ margin: '8px 0' }}>-----------------------------------</div>
              <div style={{ fontWeight: 'bold' }}>
                {receiptType === 'fiscal' ? 'Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica' : '*** EXTRATO CONTA DE PEDIDO ***'}
              </div>
              {receiptType === 'nao-fiscal' && <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>NÃO É DOCUMENTO FISCAL</div>}
              <div style={{ margin: '8px 0' }}>-----------------------------------</div>
            </div>

            <table style={{ width: '100%', marginBottom: '16px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingBottom: '8px' }}>QTD</th>
                  <th style={{ textAlign: 'left', paddingBottom: '8px' }}>DESCRIÇÃO</th>
                  <th style={{ textAlign: 'right', paddingBottom: '8px' }}>VALOR</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.cartId}>
                    <td>{formatQuantity(item.quantity, item.unit)}</td>
                    <td>{item.name.substring(0, 18)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(getItemTotal(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {customerCpf && (
              <div style={{ fontSize: '0.85rem', marginBottom: '16px', borderTop: '1px dashed #000', paddingTop: '16px' }}>
                CPF/CNPJ na nota: <strong>{customerCpf}</strong>
              </div>
            )}
            <div style={{ borderTop: '1px dashed #000', margin: '16px 0', paddingTop: '16px' }}>
              {saleSummary.itemDiscountTotal > 0 && (
                <div className="flex justify-between" style={{ marginBottom: '4px' }}>
                  <span>DESC. ITENS</span>
                  <span>-{formatCurrency(saleSummary.itemDiscountTotal)}</span>
                </div>
              )}
              {saleSummary.saleDiscountTotal > 0 && (
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <span>DESC. VENDA</span>
                  <span>-{formatCurrency(saleSummary.saleDiscountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '12px' }}>
                <span>TOTAL R$</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div style={{ marginTop: '8px', marginBottom: '12px', color: '#333' }}>
                {payments.map(p => (
                  <div key={p.id} className="flex justify-between">
                    <span>{p.method}</span>
                    <span>{formatCurrency(p.amount)}</span>
                  </div>
                ))}
              </div>
              {change > 0 && (
                <div className="flex justify-between" style={{ marginTop: '4px', fontWeight: 'bold' }}>
                  <span>TROCO R$</span>
                  <span>{formatCurrency(change)}</span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.8rem', color: '#444' }}>
              Operador: {operator.name}<br/>
              Data: {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}<br/>
              Obrigado pela preferência e volte sempre!
            </div>
          </div>
        </div>

        {/* Rodapé e Botões */}
        <div className="flex gap-4" style={{ padding: '24px', backgroundColor: 'var(--surface-100)', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-outline" style={{ flex: 1, padding: '16px' }} onClick={onClose}>Sem Nota [ESC]</button>
          <button className="btn btn-success" style={{ flex: 2, padding: '16px' }} onClick={handlePrint}>🖨️ Imprimir Recibo</button>
        </div>
      </div>
    </div>
  );
}
