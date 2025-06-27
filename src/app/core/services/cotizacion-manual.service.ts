import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject, switchMap } from 'rxjs';
import { CotizacionManual } from '../models/cotizacionManual.model';
import { CotizacionProducto } from '../models/prodCM.model';

@Injectable({
  providedIn: 'root'
})
export class CotizacionManualService {

  private _refresh$ = new Subject<void>();
    get refresh$() {
      return this._refresh$;
    }

    private url: string = 'https://afagroup-api-1cml.onrender.com/api/v1/'

  constructor(private http: HttpClient) { }

getCotizaciones(): Observable<CotizacionManual[]> {
    return this.http.get<CotizacionManual[]>(`${this.url}cotizaciones/`);
  }

  getCotizacionById(id: string): Observable<CotizacionManual> {
    return this.http.get<CotizacionManual>(`${this.url}cotizaciones/${id}`);
  }

  createCotizacion(cotizacion: CotizacionManual): Observable<CotizacionManual> {
    return this.http.post<CotizacionManual>(`${this.url}cotizaciones/`, cotizacion);
  }

  updateCotizacion(id: string, cotizacion: CotizacionManual): Observable<any> {
    return this.http.put(`${this.url}cotizaciones/${id}`, cotizacion);
  }

  deleteCotizacion(id: string): Observable<any> {
    return this.http.delete(`${this.url}cotizaciones/${id}`);
  }

  // === PRODUCTOS DE COTIZACIÓN ===

  getProductosByCotizacion(cotizacion_id: string): Observable<CotizacionProducto[]> {
    return this.http.get<CotizacionProducto[]>(`${this.url}cotizacion-productos/cotizacion/${cotizacion_id}`);
  }

  createProductoCotizado(producto: CotizacionProducto): Observable<CotizacionProducto> {
    return this.http.post<CotizacionProducto>(`${this.url}cotizacion-productos/`, producto);
  }

  updateProductoCotizado(id: string, producto: CotizacionProducto): Observable<any> {
    return this.http.put(`${this.url}cotizacion-productos/${id}`, producto);
  }

  deleteProductoCotizado(id: string): Observable<any> {
    return this.http.delete(`${this.url}cotizacion-productos/${id}`);
  }

crearCotizacionConProductos(
  cotizacion: CotizacionManual,
  productos: CotizacionProducto[]
): Observable<any> {
  return this.createCotizacion(cotizacion).pipe(
    switchMap((nuevaCotizacion) => {
      const cotizacion_id = nuevaCotizacion.id!; // Asegura que no sea undefined

      const productosConId = productos.map(prod => ({
        ...prod,
        cotizacion_id // ya es string, no string | undefined
      }));

      const peticiones = productosConId.map(prod =>
        this.createProductoCotizado(prod)
      );

      return forkJoin(peticiones);
    })
  );
}



}
