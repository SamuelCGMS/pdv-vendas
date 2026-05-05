import { useCallback, useRef, useState } from "react";
import {
  ScaleConnection,
  isWebSerialSupported,
  loadScaleConfig,
  saveScaleConfig,
} from "@shared/services/scale-serial";
import type { ScaleConfig, ScaleReading, ScaleStatus } from "@shared/services/scale-serial";

export type { ScaleConfig, ScaleReading, ScaleStatus };
export { isWebSerialSupported, loadScaleConfig, saveScaleConfig };

export type UseScaleReturn = {
  status: ScaleStatus;
  lastReading: ScaleReading | null;
  isSupported: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  readWeight: () => Promise<ScaleReading>;
};

export function useScale(): UseScaleReturn {
  const [status, setStatus] = useState<ScaleStatus>("disconnected");
  const [lastReading, setLastReading] = useState<ScaleReading | null>(null);
  const connectionRef = useRef<ScaleConnection | null>(null);
  const isSupported = isWebSerialSupported();

  const connect = useCallback(async () => {
    try {
      setStatus("connecting");
      const config = loadScaleConfig();
      const conn = new ScaleConnection(config);
      await conn.connect();
      connectionRef.current = conn;
      setStatus("connected");
    } catch (err) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Erro ao conectar";
      setLastReading({ weightKg: 0, stable: false, error: message });
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.disconnect();
      connectionRef.current = null;
    }
    setStatus("disconnected");
    setLastReading(null);
  }, []);

  const readWeight = useCallback(async (): Promise<ScaleReading> => {
    const conn = connectionRef.current;
    if (!conn || !conn.isConnected) {
      const fallback: ScaleReading = { weightKg: 0, stable: false, error: "Balança não conectada." };
      setLastReading(fallback);
      return fallback;
    }

    setStatus("reading");
    const reading = await conn.readWeight();
    setLastReading(reading);
    setStatus(reading.error ? "error" : "connected");
    return reading;
  }, []);

  return { status, lastReading, isSupported, connect, disconnect, readWeight };
}
