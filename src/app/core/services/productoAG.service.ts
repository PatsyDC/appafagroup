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

  //private url: string = 'https://afagroup-api-1cml.onrender.com/api/v1/productoAG/'
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

  getProductoById(producto_id: string): Observable<IProductoAG> {
    return this.http.get<{ ok: boolean, status: number, body: IProductoAG }>(`${this.url}${producto_id}`)
      .pipe(
        tap(response => console.log("Respuesta detalle:", response)), // Para depuración
        map(response => response.body)
      );
  }

  deleteProducto(producto_id: string): Observable<any> {
    return this.http.delete<string>(`${this.url}${producto_id}/`)
  }

  putRepuesto( producto_id: string, formData: FormData): Observable<IProductoAG> {
    return this.http.put<IProductoAG>(`${this.url}${producto_id}/`, formData);
  }

}
