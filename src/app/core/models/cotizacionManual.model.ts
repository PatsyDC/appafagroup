export interface CotizacionManual {
  id?: string;
  periodo: string;
  serie?: string;
  numero?: number;
  fecha: string;
  tipo_cambio: string;
  cliente_id?: string | null;
  punto_venta: string;
  razon_social: string;
  ruc: string;
  nombre_contacto: string;
  dni_persona: string;
  email: string;
  telefono: string;
  forma_pago: string;
  dias_ofertas: string;
  moneda: string;
  observaciones: string;
  total_precio_productos: number;
  estado?: string;
  user_id: string;
}
