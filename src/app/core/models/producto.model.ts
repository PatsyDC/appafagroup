import { ICategoriaP } from "./categoria.model";

// En models/producto.model.ts
export interface IProducto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  img: string;
  categoria_id: number;
  categoria?: ICategoriaP; // Añade esta línea
}
