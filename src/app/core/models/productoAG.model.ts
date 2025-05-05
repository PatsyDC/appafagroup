export interface IProductoAG {
  producto_id: string;
  categoria_id: number;
  nombre_producto: string;
  descripcion_producto: string;
  codigo_sunat: string;
  tipo_producto: string;
  tipo_existencia: string;
  compra: string;
  kardex: string;
  nombre_comercial: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo: number;
  peso: number;
  imagen_url: string;
  precio: number;
}

