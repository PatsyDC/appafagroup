import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ICarrito } from '../models/carrito.model';
import { HttpClient } from '@angular/common/http';
import { IProductoAG } from '../models/productoAG.model';
import { CarritoWeb } from '../models/carritoWeb.model';
import { CotizacionWeb } from '../models/cotizacionWeb.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoKey = 'carrito_data';
  private carritoSubject = new BehaviorSubject<ICarrito>(this.initCarrito());
  private apiUrl = 'http://localhost:3000/api/v1/carrito/';
  private apiCotizacion = 'http://localhost:3000/api/v1/cotizacionw/'

  constructor(private http: HttpClient) {
    this.cargarCarritoLocalStorage();
  }

  private initCarrito(): ICarrito {
    return { items: [], total: 0, cantidadTotal: 0 };
  }

  private cargarCarritoLocalStorage(): void {
    const carritoGuardado = localStorage.getItem(this.carritoKey);
    if (carritoGuardado) {
      this.carritoSubject.next(JSON.parse(carritoGuardado));
    }
  }

  private guardarCarritoLocalStorage(): void {
    localStorage.setItem(this.carritoKey, JSON.stringify(this.carritoSubject.value));
  }

  getCarrito(): Observable<ICarrito> {
    return this.carritoSubject.asObservable();
  }

  getCarritoValue(): ICarrito {
    return this.carritoSubject.value;
  }

  agregarProducto(producto: IProductoAG, cantidad: number = 1): void {
    const carrito = this.carritoSubject.value;
    const itemExistente = carrito.items.find(item => item.producto.producto_id === producto.producto_id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.producto.precio;
    } else {
      carrito.items.push({
        producto,
        cantidad,
        subtotal: producto.precio * cantidad
      });
    }

    this.actualizarTotales(carrito);
    this.carritoSubject.next(carrito);
    this.guardarCarritoLocalStorage();
  }

  eliminarProducto(productoId: number): void {
    const carrito = this.carritoSubject.value;
    carrito.items = carrito.items.filter(item => item.producto.producto_id !== productoId);

    this.actualizarTotales(carrito);
    this.carritoSubject.next(carrito);
    this.guardarCarritoLocalStorage();
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarProducto(productoId);
      return;
    }

    const carrito = this.carritoSubject.value;
    const itemExistente = carrito.items.find(item => item.producto.producto_id === productoId);

    if (itemExistente) {
      itemExistente.cantidad = cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.producto.precio;

      this.actualizarTotales(carrito);
      this.carritoSubject.next(carrito);
      this.guardarCarritoLocalStorage();
    }
  }

  vaciarCarrito(): void {
    this.carritoSubject.next(this.initCarrito());
    localStorage.removeItem(this.carritoKey);
  }

  private actualizarTotales(carrito: ICarrito): void {
    carrito.total = carrito.items.reduce((sum, item) => sum + item.subtotal, 0);
    carrito.cantidadTotal = carrito.items.reduce((sum, item) => sum + item.cantidad, 0);
  }

  guardarCarrito(carrito: any) {
    return this.http.post(this.apiUrl, carrito);
  }

  allCarritoWeb(): Observable<CarritoWeb[]> {
      return this.http.get<{ ok: boolean, status: number, body: CarritoWeb[] }>(this.apiUrl)
            .pipe(
              tap(response => console.log("Respuesta de API:", response)),
              map(response => response.body || [])
            );
  }

  getCarritoById(carritoId: string): Observable<CarritoWeb> {
    return this.http.get<{ ok: boolean, status: number, body: CarritoWeb }>(`${this.apiUrl}${carritoId}`)
      .pipe(
        tap(response => console.log("Respuesta de API para carrito específico:", response)),
        map(response => response.body)
      );
  }

  guardarCotizacion(cotizacion: CotizacionWeb): Observable<any> {
    return this.http.post(this.apiCotizacion, cotizacion);
  }

}
