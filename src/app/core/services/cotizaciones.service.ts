import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Cotizacion } from '../models/cotizacion.model';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = "http://localhost:3000/cotizaciones/"

  constructor(private http: HttpClient) { }

  getCotizaciones(): Observable<Cotizacion[]> {
    return this.http.get<Cotizacion[]>(this.url);
  }

  getCotizacionById(id: number): Observable<Cotizacion>{
    return this.http.get<Cotizacion>(`${this.url}${id}`);
  }

  postCotizacion(cotizacion: Cotizacion): Observable<Cotizacion>{
    return this.http.post<Cotizacion>(this.url, cotizacion)
    .pipe(
      tap(() => {
        this._refresh$.next();
      }));
  }

  deleteCotizacion(id: number): Observable<any>{
    return this.http.delete<Cotizacion>(`${this.url}${id}`);
  }


  putCotizacion(cotizacion: Cotizacion): Observable<Cotizacion> {
    return this.http.put<Cotizacion>(`${this.url}${cotizacion.id}`, cotizacion);
  }

}
