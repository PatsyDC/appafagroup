export interface Cotizacion {
  id: number;                     // ID de la cotización
  periodo: string;                 // Periodo de la cotización (e.g., año y mes)
  serie: string;                   // Serie de la cotización
  numero: number;                  // Número de la cotización
  fecha: string;                   // Fecha en formato 'YYYY-MM-DD'
  TC: number;                      // Tipo de cambio (e.g., 3.85)
  punto_venta: string;             // Punto de venta
  dni_ruc: string;                 // DNI o RUC del cliente
  razon_social: string;            // Razón social del cliente
  gmail: string;                   // Email del cliente
  telefono: string;                // Teléfono del cliente
  forma_pago: string;              // Forma de pago (e.g., 'Contado')
  dias_oferta: number;             // Días de validez de la oferta
  moneda: string;                  // Moneda de la cotización (e.g., 'PEN')
  observacion: string;             // Observaciones adicionales
  id_producto: number;             // ID del producto
  cantidad_producto: number;       // Cantidad del producto
  precio_producto: number;         // Precio unitario del producto
  descuento: number;               // Descuento aplicado al producto
  precio_total: number;            // Precio total con descuento
}
