import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { ICategoriaP } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private url: string = 'http://localhost:3000/api/v1/categoria/';
  //private url: string = 'https://afagroup-api-1cml.onrender.com/api/v1/categoria/'

  constructor(private http: HttpClient) { }

  allCategorias(): Observable<ICategoriaP[]> {
    return this.http.get<{ ok: boolean, status: number, body: ICategoriaP[] }>(this.url)
          .pipe(
            tap(response => console.log("Respuesta de API:", response)), // Para depuración
            map(response => response.body || []) // Extraer `body` y asegurarse de que sea un array
          );
  }

  getCategoriaById(categoria_id: number): Observable<ICategoriaP> {
    return this.http.get<ICategoriaP>(`${this.url}${categoria_id}`);
  }

  postCategoria(categoria: ICategoriaP): Observable<ICategoriaP>{
    return this.http.post<ICategoriaP>(this.url, categoria)
    .pipe(
      tap(() => {
        this._refresh$.next();
      }));
  }

  deleteCategoria(categoria_id: number): Observable<any> {
    return this.http.delete<number>(`${this.url}${categoria_id}/`)
  }

  putCategoria(mascota: ICategoriaP, categoria_id:any): Observable<ICategoriaP>{
    return this.http.put<ICategoriaP>(`${this.url}${categoria_id}`, mascota);
  }

}
