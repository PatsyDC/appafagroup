import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IProducto } from './../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/productosP';
  constructor(private http: HttpClient) {}

  allProductos(): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(this.url);
  }

  getProductoById(id: number): Observable<IProducto> {
    return this.http.get<IProducto>(`${this.url}/${id}`);
  }
}
