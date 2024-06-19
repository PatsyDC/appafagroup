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

  // En carrito.service.ts
  // En carrito.service.ts

updateProductQuantity(productId: number, quantity: number): Observable<ICarrito> {
  // No necesitas acceder a cartItems aquí, solo necesitas el ID del producto y la nueva cantidad
  return this.http.put<ICarrito>(`${this.urlCarrito}/${productId}`, { quantity });
}



  // En carrito.service.ts

  incrementProductQuantity(productId: number, currentQuantity: number): Observable<ICarrito> {
    return this.updateProductQuantity(productId, currentQuantity + 1);
  }

  decrementProductQuantity(productId: number, currentQuantity: number): Observable<ICarrito> {
    return this.updateProductQuantity(productId, Math.max(currentQuantity - 1, 0)); // Asegura que la cantidad no sea negativa
  }

  removeProductFromCart(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.urlRepuestos}/carrito/${productId}`);
  }
}

