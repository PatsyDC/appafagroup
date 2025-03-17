export interface CotizacionWeb {
  id: number;
  periodo: string;
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
  vendedor_trabajador: string,
  observaciones: string
  productos: any[];
  total_precio_productos: number; // Total del precio de los productos
}
