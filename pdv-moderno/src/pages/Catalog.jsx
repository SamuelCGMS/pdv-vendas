import React, { useState } from 'react';
import { products as initialProducts } from '../data/mock';

export default function Catalog() {
  const [products] = useState(initialProducts);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search));

  return (
    <div className="flex-col h-full w-full" style={{ padding: '32px', overflowY: 'auto' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Gestão de Estoque</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Catálogo completo de produtos registrados</p>
        </div>
        <button className="btn btn-primary">+ Novo Produto</button>
      </div>

      <div className="card glass flex-col" style={{ padding: '24px', flex: 1, overflow: 'hidden' }}>
        <input 
          type="text" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar catálogo pelo nome ou código EAN..." 
          style={{ width: '100%', padding: '16px 20px', fontSize: '1.2rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--border)', outline: 'none', marginBottom: '24px', transition: 'border-color 0.2s' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />

        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-100)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--surface-300)' }}>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px' }}>CÓDIGO (EAN)</th>
                <th style={{ padding: '16px' }}>PRODUTO</th>
                <th style={{ padding: '16px' }}>CATEGORIA</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>UN. MEDIDA</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>VALOR (R$)</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>{p.id}</td>
                  <td style={{ padding: '16px', fontWeight: '600' }}>{p.name}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '6px 12px', backgroundColor: 'var(--surface-200)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 'bold' }}>{p.category}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>{p.unit.toUpperCase()}</td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>R$ {p.price.toFixed(2).replace('.', ',')}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Editar</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-tertiary)' }}>Nenhum produto encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
