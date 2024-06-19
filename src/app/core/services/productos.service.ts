import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, Subject } from 'rxjs';
import { IProducto } from './../models/producto.model';
import { ICategoriaP } from './../models/categoria.model'; // Asegúrate de importar ICategoriaP si aún no lo has hecho

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private urlProductos: string = 'http://localhost:3000/productosP';
  private urlCategorias: string = 'http://localhost:3000/categorias';

  constructor(private http: HttpClient) {}

  allProductos(): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(this.urlProductos);
  }

  allCategorias(): Observable<ICategoriaP[]> {
    return this.http.get<ICategoriaP[]>(this.urlCategorias);
  }

  allProductosWithCategories(): Observable<IProducto[]> {
    return forkJoin([this.allProductos(), this.allCategorias()])
    .pipe(map(([productos, categorias]) => {
        return productos.map(producto => ({
        ...producto,
          categoria: categorias.find(categoria => categoria.id === producto.categoria_id)
        }));
      }));
  }

  getProductoById(id: number): Observable<IProducto> {
    return this.http.get<IProducto>(`${this.urlProductos}/${id}`);
  }
}
