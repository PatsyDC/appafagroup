import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
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

  postCategoria(categoria: ICategoriaP): Observable<ICategoriaP>{
    return this.http.post<ICategoriaP>(this.url, categoria)
    .pipe(
      tap(() => {
        this._refresh$.next();
      }));
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete<number>(`${this.url}/${id}`)
  }

  putCategoria(mascota: ICategoriaP, id:any): Observable<ICategoriaP>{
    return this.http.put<ICategoriaP>(`${this.url}/${id}`, mascota);
  }

}
