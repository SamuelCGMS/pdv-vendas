import React, { useState, useEffect } from 'react';

export default function Header({ operator, runtime }) {
  const [time, setTime] = useState(new Date());
  const workstationLabel = operator.workstation?.name ?? 'Caixa principal';
  const workstationZone = operator.workstation?.zone ?? 'Atendimento do dia';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const runtimeLabel = runtime?.isElectron
    ? `Desktop ${runtime.version}`
    : 'Prévia local';

  return (
    <div className="flex justify-between items-center" style={{ 
      height: '64px', 
      padding: '0 24px', 
      backgroundColor: 'var(--surface-100)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="flex items-center gap-4">
        <div className="flex-col" style={{ gap: '2px' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '2px' }}>
            {workstationLabel.toUpperCase()}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>
            {workstationZone}
          </span>
        </div>
        <span style={{ color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--success)', borderRadius: '50%' }}></div>
          ABERTO
        </span>
      </div>

      <div className="flex items-center gap-6">
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
          {runtimeLabel}
        </span>
        <div className="flex items-center gap-2">
          <img src={operator.avatar} alt={operator.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <span style={{ fontWeight: '600' }}>{operator.name}</span>
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'monospace' }}>
          {time.toLocaleTimeString('pt-BR')}
        </div>
      </div>
    </div>
  );
}
