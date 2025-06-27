export interface CotizacionProducto {
  id?: string; // UUID generado automáticamente
  cotizacion_id: string;
  producto_id?: string | null;
  nombre_producto: string;
  precio: number;
  cantidad: number;
  unidad: string;
  subtotal: number;
}
