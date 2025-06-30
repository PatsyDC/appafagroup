import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { ICarrito } from '../models/carrito.model';
import { HttpClient } from '@angular/common/http';
import { IProductoAG } from '../models/productoAG.model';
import { CarritoWeb } from '../models/carritoWeb.model';
import { CotizacionWeb } from '../models/cotizacionWeb.model';
import { CotizacionManualService } from './cotizacion-manual.service';

function formatMonth(mesAno: string): string {
  const [ano, mes] = mesAno.split('-');
  const meses = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  return `${meses[+mes - 1]} ${ano}`;
}

interface ProductoCotizado {
  nombre: string;
  cantidad: number;
  cotizaciones: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoKey = 'carrito_data';
  private carritoSubject = new BehaviorSubject<ICarrito>(this.initCarrito());
  //private apiUrl = 'http://localhost:3000/api/v1/carrito/';
  private apiUrl = 'https://afagroup-api-1cml.onrender.com/api/v1/carrito/';
  //private apiCotizacion = 'http://localhost:3000/api/v1/cotizacionw/'
  private apiCotizacion = 'https://afagroup-api-1cml.onrender.com/api/v1/cotizacionw/'

  // ✅ Correcto
constructor(
  private http: HttpClient,
  private cotizacionManualService: CotizacionManualService
) {
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

  eliminarProducto(productoId: string): void {
    const carrito = this.carritoSubject.value;
    carrito.items = carrito.items.filter(item => item.producto.producto_id !== productoId);

    this.actualizarTotales(carrito);
    this.carritoSubject.next(carrito);
    this.guardarCarritoLocalStorage();
  }

  actualizarCantidad(productoId: string, cantidad: number): void {
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

  contarCotizaciones(): Observable<CotizacionWeb[]> {
    return this.http.get<{ ok: boolean, body: CotizacionWeb[] }>(this.apiCotizacion)
      .pipe(map(res => res.body || []));
  }

  getCotizacionesPorMes(): Observable<any[]> {
    return this.http.get<{ ok: boolean, body: CotizacionWeb[] }>(this.apiCotizacion)
      .pipe(
        map(res => {
          const cotizaciones = res.body || [];

          const cotizacionesPorMes = cotizaciones.reduce((acc, cotizacion) => {
            const fecha = new Date(cotizacion.fecha || cotizacion.createdAt);
            const mesAno = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!acc[mesAno]) acc[mesAno] = 0;
            acc[mesAno]++;
            return acc;
          }, {} as { [key: string]: number });

          return Object.entries(cotizacionesPorMes)
            .map(([mes, cantidad]) => ({
              mes: formatMonth(`${mes}-01`),  // <- Asegura que es una fecha válida
              cantidad
            }))
            .sort((a, b) => {
              const fechaA = new Date(`${a.mes}-01`);
              const fechaB = new Date(`${b.mes}-01`);
              return fechaA.getTime() - fechaB.getTime();
            });
        })
      );
  }

  getProductosMasCotizados(): Observable<ProductoCotizado[]> {
  return forkJoin([
    this.allCarritoWeb(), // Cotizaciones web
    this.cotizacionManualService.getCotizacionesGrafica(), // Cotizaciones manuales
    this.cotizacionManualService.getTodosLosProductosManuales()
  ]).pipe(
    map(([cotizacionesWeb, cotizacionesManuales, productosManuales]) => {
      const productosMap = new Map<string, ProductoCotizado>();

      // Procesar cotizaciones web
      cotizacionesWeb.forEach(cotizacion => {
        try {
          // El campo productos viene como string JSON escapado
          let productosArray;
          if (typeof cotizacion.productos === 'string') {
            const productosClean = (cotizacion.productos as string).replace(/\\/g, '');
            productosArray = JSON.parse(productosClean);
          }
          else {
            productosArray = cotizacion.productos;
          }

          if (Array.isArray(productosArray)) {
            productosArray.forEach((producto: any) => {
              const nombre = producto.nombre || 'Producto sin nombre';
              const cantidad = parseInt(producto.cantidad) || 0;

              if (productosMap.has(nombre)) {
                const existing = productosMap.get(nombre)!;
                existing.cantidad += cantidad;
                existing.cotizaciones += 1;
              } else {
                productosMap.set(nombre, {
                  nombre,
                  cantidad,
                  cotizaciones: 1
                });
              }
            });
          }
        } catch (error) {
          console.warn('Error al parsear productos de cotización web:', cotizacion.carrito_id, error);
        }
      });

      // Procesar cotizaciones manuales
      productosManuales.forEach((producto: any) => {
        const nombre = producto.nombre_producto || 'Producto sin nombre';
        const cantidad = parseInt(producto.cantidad) || 0;

        if (productosMap.has(nombre)) {
          const existing = productosMap.get(nombre)!;
          existing.cantidad += cantidad;
          existing.cotizaciones += 1;
        } else {
          productosMap.set(nombre, {
            nombre,
            cantidad,
            cotizaciones: 1
          });
        }
      });

      // Convertir a array y ordenar por cantidad total
      return Array.from(productosMap.values())
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10); // Top 10 productos más cotizados
    }),
    catchError(error => {
      console.error('Error al obtener productos más cotizados:', error);
      return of([]);
    })
  );
}
}
