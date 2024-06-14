import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ITrabajador } from '../models/trabajador.model';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/miembrosE';
  constructor(private http: HttpClient) { }

  allTrabajadores(): Observable<ITrabajador[]>{
    return this.http.get<ITrabajador[]>(this.url)
  }
}
