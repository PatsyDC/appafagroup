export interface CotizacionWeb {
  id: number;
  carrito_id: number;
  periodo: string;
  serie: string;
  numero: number;
  fecha: string;
  tipo_cambio: number;
  punto_venta: string;
  razon_social?: string;
  ruc?: string;
  nombre_contacto: string,
  dni_persona: string,
  email: string,
  telefono: string,
  forma_pago: string,
  dias_ofertas: string,
  moneda: string,
  observaciones: string
  productos: any[];
  total_precio_productos: number;
  estado?: string,
  user_id?: string,
  fecha_asignacion?: Date,
  fecha_finalizacion?: Date
}
