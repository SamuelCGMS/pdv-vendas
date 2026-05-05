type SerialParity = "none" | "even" | "odd";
type SerialFlowControl = "none" | "hardware";

type SerialPortRequestOptions = {
  filters?: Array<{
    usbVendorId?: number;
    usbProductId?: number;
  }>;
};

type SerialOptions = {
  baudRate: number;
  dataBits?: number;
  stopBits?: number;
  parity?: SerialParity;
  flowControl?: SerialFlowControl;
  bufferSize?: number;
};

interface SerialPort {
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;
  open(options: SerialOptions): Promise<void>;
  close(): Promise<void>;
}

interface Serial {
  requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
  getPorts(): Promise<SerialPort[]>;
}

interface Navigator {
  readonly serial?: Serial;
}
