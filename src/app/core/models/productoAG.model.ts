export interface IProductoAG {
  producto_id: number;  // Opcional porque podría generarse automáticamente
  categoria_id: string;
  nombre_producto: string;
  codigo_sunat: string;
  tipo_producto: string;
  tipo_existencia: string;
  compra: string;
  kardex: string;
  nombre_comercial: string;
  stock_minimo: number;
  stock_maximo: number;
  peso: number;
  imagen_url?: string; // Opcional ya que en el modelo puede ser null
}

