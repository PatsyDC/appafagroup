import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { IProducto } from './../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private _refresh$ = new Subject<void>();
  get refresh$(){
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/productosP'
  constructor(private http: HttpClient) { }

  allProductos(): Observable<IProducto[]> {
    return this.http.get<IProducto[]>(this.url);
  }

  getProductoById(id: any): Observable<IProducto> {
    return this.http.get<IProducto>(`${this.url}/${id}`);
  }
}
