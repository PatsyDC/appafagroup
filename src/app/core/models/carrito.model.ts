import { IProductoAG } from './productoAG.model';

export interface IItemCarrito {
  producto: IProductoAG;
  cantidad: number;
  subtotal: number;
}

export interface ICarrito {
  items: IItemCarrito[];
  total: number;
  cantidadTotal: number;
}
