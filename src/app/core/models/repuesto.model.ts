import { ICategoriaP } from "./categoria.model";

export interface IRepuesto {
  id: number;
  img: string;
  nombre: string;
  categoria_id: number;
  descripcion: string;
  precio: number;
  categoria?: ICategoriaP;
  codigo:String;
}
