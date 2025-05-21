import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { IContacto } from '../models/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private _refresh$ = new Subject<void>();
  get refresh$(){
    return this._refresh$;
  }

  private url: string = 'https://afagroup-api.onrender.com/api/v1/contacto/'
  //private url: string = 'http://localhost:3000/api/v1/contacto/'
  constructor(private http: HttpClient) { }

  saveContacto(contacto: IContacto): Observable<IContacto>{
    return this.http.post<IContacto>(this.url, contacto)
    .pipe(
      tap(()=>{
      this._refresh$.next();
    }));
  }

  allContacto(): Observable<IContacto[]> {
    return this.http.get<{ ok: boolean, status: number, body: IContacto[] }>(this.url)
      .pipe(
        tap(response => console.log("Respuesta de API:", response)), // Para depuración
        map(response => response.body || []) // Extraer `body` y asegurarse de que sea un array
      );
  }

}
