import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';

const fallbackRuntime = Object.freeze({
  appName: 'Gravity PDV',
  environment: 'development',
  isElectron: false,
  isPackaged: false,
  platform: 'browser',
  version: '0.0.0',
});

export function useAppRuntime() {
  const [runtime, setRuntime] = useState(fallbackRuntime);

  const applyRuntime = useEffectEvent((nextRuntime) => {
    startTransition(() => {
      setRuntime({
        ...nextRuntime,
        isElectron: true,
      });
    });
  });

  useEffect(() => {
    if (!window.electronAPI?.getRuntimeInfo) {
      return;
    }

    let active = true;

    void window.electronAPI
      .getRuntimeInfo()
      .then((result) => {
        if (!active || !result.ok) {
          return;
        }

        applyRuntime(result.data);
      })
      .catch(() => {
        // Mantém o fallback local quando o shell desktop ainda não estiver disponível.
      });

    return () => {
      active = false;
    };
  }, []);

  return runtime;
}
