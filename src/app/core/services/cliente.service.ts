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

  //private url: string = 'http://localhost:3000/api/v1/cliente/'
  private url: string = 'https://afagroup-api-1cml.onrender.com/api/v1/cliente/'

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

    buscarClientesPorRazonSocial(termino: string): Observable<ICliente[]> {
    if (!termino || termino.trim().length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    // Opción 1: Si tu API tiene un endpoint específico para búsqueda
    // return this.http.get<{ ok: boolean, status: number, body: ICliente[] }>(`${this.url}buscar?razon_social=${encodeURIComponent(termino)}`)
    //   .pipe(
    //     map(response => response.body || [])
    //   );

    // Opción 2: Filtrar del lado del cliente (si no tienes endpoint de búsqueda)
    return this.allClientes().pipe(
      map(clientes => {
        const terminoLower = termino.toLowerCase().trim();
        return clientes.filter(cliente =>
          cliente.razon_social.toLowerCase().includes(terminoLower) ||
          cliente.codigo_ruc.includes(terminoLower) ||
          (cliente.nombre_persona && cliente.nombre_persona.toLowerCase().includes(terminoLower))
        ).slice(0, 10); // Limitar a 10 resultados
      })
    );
  }

  // Método adicional para buscar cliente por RUC exacto
  buscarClientePorRuc(ruc: string): Observable<ICliente | null> {
    return this.allClientes().pipe(
      map(clientes => {
        const cliente = clientes.find(c => c.codigo_ruc === ruc);
        return cliente || null;
      })
    );
  }

}
