export interface DesgloseItem {
  concepto: string;
  monto: number;
}

export interface PagoPendiente {
  mes: string;
  vencimiento: string;
  desglose: DesgloseItem[];
  total: number;
}

export interface Pago {
  id: string;
  concepto: string;
  mes: string;
  monto: number;
  fecha: string;
  metodo: string;
  comprobante: string;
}