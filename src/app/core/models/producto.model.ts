import { ICategoriaP } from "./categoria.model";

// En models/producto.model.ts
export interface IProducto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  img: string;
  categoria_id: number;
  categoria?: ICategoriaP; // Añade esta línea
  ficha_p: string;
  pdf: string;
}
