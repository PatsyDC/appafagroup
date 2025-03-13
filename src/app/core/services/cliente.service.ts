import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { ICliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/api/v1/cliente/'

  constructor(private http: HttpClient) {}

  allClientes(): Observable<ICliente[]> {
    return this.http.get<{ ok: boolean, status: number, body: ICliente[] }>(this.url)
          .pipe(
            tap(response => console.log("Respuesta de API:", response)), // Para depuración
            map(response => response.body || []) // Extraer `body` y asegurarse de que sea un array
          );
  }

  getClienteById(cliente_id: number): Observable<ICliente> {
    return this.http.get<ICliente>(`${this.url}${cliente_id}/`);
  }

  postCliente(cliente: ICliente): Observable<ICliente>{
    return this.http.post<ICliente>(this.url, cliente)
    .pipe(
      tap(() => {
        this._refresh$.next();
      }));
  }

  deleteCliente(cliente_id: number): Observable<any> {
    return this.http.delete<number>(`${this.url}${cliente_id}/`)
  }

  putCliente(cliente: ICliente, cliente_id:any): Observable<ICliente>{
    return this.http.put<ICliente>(`${this.url}${cliente_id}/`, cliente);
  }

}
