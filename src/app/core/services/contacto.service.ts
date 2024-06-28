import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { IContacto } from '../models/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private _refresh$ = new Subject<void>();
  get refresh$(){
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/contactanos'
  constructor(private http: HttpClient) { }

  saveContacto(contacto: IContacto): Observable<IContacto>{
    return this.http.post<IContacto>(this.url, contacto)
    .pipe(
      tap(()=>{
      this._refresh$.next();
    }));
  }

  allContacto(): Observable<IContacto[]> {
    return this.http.get<IContacto[]>(this.url);
  }

}
