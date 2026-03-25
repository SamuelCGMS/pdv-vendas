import React, {
  useState,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
} from 'react';
import scaleService from '../services/scaleService';

/**
 * ScaleWeighModal
 * 
 * Appears when adding a product with unit='kg' to the cart.
 * Reads weight from scale, shows confirmation, allows manual entry.
 */
export default function ScaleWeighModal({ product, onConfirm, onCancel }) {
  const [state, setState] = useState('idle'); // idle | reading | success | no_weight | manual | error
  const [weight, setWeight] = useState(0);
  const [manualWeight, setManualWeight] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isStable, setIsStable] = useState(true);
  const manualInputRef = useRef(null);

  const subtotal = weight * product.price;

  const readWeight = useCallback(async () => {
    if (!scaleService.isConnected()) {
      setState('error');
      setErrorMsg('Balança não conectada. Conecte em Configurações ou digite o peso manualmente.');
      return;
    }

    setState('reading');
    setErrorMsg('');

    try {
      const result = await scaleService.requestWeight();

      if (result.success && result.weight > 0) {
        setWeight(result.weight);
        setIsStable(result.stable !== false);
        setState('success');
      } else if (result.success && result.weight === 0) {
        setState('no_weight');
        setErrorMsg('Nenhum peso detectado. Coloque o produto na balança e tente novamente.');
      } else {
        setState('no_weight');
        setErrorMsg(result.error || 'Não foi possível ler o peso.');
      }
    } catch (error) {
      setState('error');
      setErrorMsg(error instanceof Error ? error.message : 'Falha ao ler o peso da balança.');
    }
  }, []);

  const requestInitialWeight = useEffectEvent(() => {
    void readWeight();
  });

  useEffect(() => {
    requestInitialWeight();
  }, []);

  useEffect(() => {
    if (state === 'manual' && manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [state]);

  const handleConfirm = useCallback(() => {
    if (state === 'manual') {
      const parsed = parseFloat(manualWeight.replace(',', '.'));
      if (isNaN(parsed) || parsed <= 0) {
        setErrorMsg('Digite um peso válido maior que zero.');
        return;
      }
      onConfirm(parsed);
    } else if (state === 'success' && weight > 0) {
      onConfirm(weight);
    }
  }, [state, weight, manualWeight, onConfirm]);

  const switchToManual = useCallback(() => {
    setState('manual');
    setManualWeight('');
    setErrorMsg('');
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleConfirm();
  };

  // Keyboard: Enter to confirm, Escape to cancel
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div className="scale-modal-overlay">
      <div className="scale-modal card glass" style={{ width: '560px', padding: '0', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          padding: '24px 32px',
          color: 'var(--text-white)',
        }}>
          <div className="flex items-center gap-4">
            <span style={{ fontSize: '2.5rem' }}>⚖️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>Pesagem de Produto</h2>
              <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem', marginTop: '4px' }}>
                Coloque o produto na balança
              </p>
            </div>
          </div>
        </div>

        <div className="flex-col" style={{ padding: '32px' }}>
          
          {/* Product Info */}
          <div className="flex justify-between items-center" style={{
            padding: '16px 20px',
            backgroundColor: 'var(--surface-200)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{product.name}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>Cód: {product.id}</div>
            </div>
            <div style={{ fontWeight: '700', fontSize: '1.3rem', color: 'var(--primary)' }}>
              R$ {product.price.toFixed(2).replace('.', ',')} / kg
            </div>
          </div>

          {/* Weight Display Area */}
          {state !== 'manual' && (
            <div className="flex-col items-center justify-center" style={{
              padding: '32px',
              backgroundColor: state === 'success' ? 'rgba(25, 128, 56, 0.05)' : 'var(--surface-200)',
              borderRadius: 'var(--radius-lg)',
              border: state === 'success'
                ? '2px solid var(--success)'
                : state === 'no_weight' || state === 'error'
                  ? '2px solid var(--danger)'
                  : '2px solid var(--border)',
              marginBottom: '24px',
              transition: 'all 0.3s ease',
              minHeight: '140px',
            }}>
              {state === 'idle' || state === 'reading' ? (
                <>
                  <div className="scale-pulse" style={{ fontSize: '2rem', marginBottom: '12px' }}>⚖️</div>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    Lendo peso da balança...
                  </span>
                  <div className="scale-reading-dots" style={{ marginTop: '8px' }}>
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </>
              ) : state === 'success' ? (
                <>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Peso {isStable ? 'Estável' : 'Instável'}
                  </span>
                  <div className="weight-display">
                    {weight.toFixed(3).replace('.', ',')}
                    <span className="weight-unit">kg</span>
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    Subtotal: <strong style={{ color: 'var(--success)', fontSize: '1.4rem' }}>
                      R$ {subtotal.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                  {!isStable && (
                    <div style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: 'rgba(241, 194, 27, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--warning)', fontSize: '0.85rem', fontWeight: '600' }}>
                      ⚠️ Peso instável — aguarde estabilizar ou confirme assim
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                    {state === 'error' ? '❌' : '⚠️'}
                  </div>
                  <span style={{ fontSize: '1.1rem', color: 'var(--danger)', fontWeight: '600', textAlign: 'center' }}>
                    {errorMsg}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Manual Weight Input */}
          {state === 'manual' && (
            <form onSubmit={handleManualSubmit} className="flex-col" style={{ marginBottom: '24px' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '1rem' }}>
                ✏️ Digite o peso em quilogramas:
              </label>
              <div className="flex gap-4 items-center">
                <input
                  ref={manualInputRef}
                  type="text"
                  value={manualWeight}
                  onChange={(e) => {
                    setManualWeight(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Ex: 1,500"
                  style={{
                    flex: 1,
                    padding: '18px 20px',
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--primary)',
                    outline: 'none',
                    textAlign: 'center',
                    backgroundColor: 'var(--surface-100)',
                    color: 'var(--text-primary)',
                  }}
                />
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-secondary)' }}>kg</span>
              </div>
              {manualWeight && !isNaN(parseFloat(manualWeight.replace(',', '.'))) && parseFloat(manualWeight.replace(',', '.')) > 0 && (
                <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                  Subtotal: <strong style={{ color: 'var(--success)', fontSize: '1.3rem' }}>
                    R$ {(parseFloat(manualWeight.replace(',', '.')) * product.price).toFixed(2).replace('.', ',')}
                  </strong>
                </div>
              )}
              {errorMsg && (
                <div style={{ marginTop: '8px', color: 'var(--danger)', fontSize: '0.9rem', fontWeight: '500' }}>
                  {errorMsg}
                </div>
              )}
            </form>
          )}

          {/* Action Buttons */}
          <div className="flex-col gap-3">
            {/* Primary action */}
            {(state === 'success' || state === 'manual') && (
              <button
                className="btn btn-success"
                style={{ width: '100%', fontSize: '1.2rem', padding: '18px', fontWeight: '700', boxShadow: '0 6px 16px rgba(25, 128, 56, 0.25)' }}
                onClick={handleConfirm}
              >
                ✅ Confirmar Peso{state === 'success' ? ` — ${weight.toFixed(3).replace('.', ',')} kg` : ''}
              </button>
            )}

            {/* Secondary actions */}
            <div className="flex gap-3">
              {state !== 'manual' && (
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '14px' }}
                  onClick={readWeight}
                  disabled={state === 'reading'}
                >
                  🔄 {state === 'reading' ? 'Lendo...' : 'Pesar Novamente'}
                </button>
              )}
              {state !== 'manual' ? (
                <button
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '14px' }}
                  onClick={switchToManual}
                >
                  ✏️ Digitar Peso
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '14px' }}
                  onClick={() => {
                    setState('idle');
                    readWeight();
                  }}
                >
                  ⚖️ Usar Balança
                </button>
              )}
            </div>

            {/* Cancel */}
            <button
              className="btn btn-danger"
              style={{ width: '100%', padding: '14px', marginTop: '4px' }}
              onClick={onCancel}
            >
              ❌ Cancelar [ESC]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
