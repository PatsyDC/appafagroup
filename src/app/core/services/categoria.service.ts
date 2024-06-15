import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ICategoriaP } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/categorias';

  constructor(private http: HttpClient) { }

  allCategorias(): Observable<ICategoriaP[]> {
    return this.http.get<ICategoriaP[]>(this.url);
  }

  getCategoriaById(id: number): Observable<ICategoriaP> {
    return this.http.get<ICategoriaP>(`${this.url}/${id}`);
  }
}
