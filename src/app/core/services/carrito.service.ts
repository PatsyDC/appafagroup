import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, Subject } from 'rxjs';
import { ICarrito } from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }
  private urlCarrito = 'http://localhost:3000/carrito';
  private urlRepuestos: string = 'http://localhost:3000/productosP';
  private urlEquipos: string = 'http://localhost:3000/repuestos';

  constructor(private http: HttpClient) { }

  allCarrito(): Observable<ICarrito[]> {
    return this.http.get<ICarrito[]>(this.urlCarrito);
  }

  getCarritoById(id: number, tipoProducto: 'repuesto' | 'equipo'): Observable<ICarrito> {
    let urlBase: string;
    switch (tipoProducto) {
      case 'repuesto':
        urlBase = `${this.urlRepuestos}/${id}`;
        break;
      case 'equipo':
        urlBase = `${this.urlEquipos}/${id}`;
        break;
      default:
        throw new Error('Tipo de producto inválido');
    }
    return this.http.get<ICarrito>(urlBase);
  }

  addProductToCart(product: ICarrito): Observable<ICarrito> {
    return this.http.post<ICarrito>(`${this.urlRepuestos}/carrito`, product); // Cambiar aquí
  }

  removeProductFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.urlRepuestos}/carrito/${productId}`);
  }
}

