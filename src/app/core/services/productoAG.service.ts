import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { IProductoAG } from '../models/productoAG.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoAGService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/api/v1/productoAG/';

  constructor(private http: HttpClient) { }

  allProductos(): Observable<IProductoAG[]> {
    return this.http.get<{ ok: boolean, status: number, body: IProductoAG[] }>(this.url)
              .pipe(
                tap(response => console.log("Respuesta de API:", response)), // Para depuración
                map(response => response.body || [])
              );
  }

  postProducto(formData: FormData): Observable<IProductoAG> {
    return this.http.post<IProductoAG>(`${this.url}`, formData);
  }

  getProductoById(producto_id: number): Observable<IProductoAG> {
    return this.http.get<IProductoAG>(`${this.url}${producto_id}/`);
  }

  deleteProducto(producto_id: number): Observable<any> {
    return this.http.delete<number>(`${this.url}${producto_id}/`)
  }

  putRepuesto( producto_id: number, formData: FormData): Observable<IProductoAG> {
    return this.http.put<IProductoAG>(`${this.url}${producto_id}/`, formData);
  }

}
