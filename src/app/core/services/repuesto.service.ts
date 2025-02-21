import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, Subject } from 'rxjs';
import { IRepuesto } from '../models/repuesto.model';
import { ICategoriaP } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class RepuestoService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private urlRepuesto: string = 'http://localhost:3000/repuestos';
  private urlCategorias: string = 'http://localhost:3000/categorias';

  constructor(private http: HttpClient) { }

  allRepuestos(): Observable<IRepuesto[]> {
    return this.http.get<IRepuesto[]>(this.urlRepuesto);
  }

  allCategorias(): Observable<ICategoriaP[]> {
    return this.http.get<ICategoriaP[]>(this.urlCategorias);
  }

  allRepuestosWithCategories(): Observable<IRepuesto[]> {
    return forkJoin([this.allRepuestos(), this.allCategorias()])
    .pipe(map(([repuesto, categorias]) => {
        return repuesto.map(repuesto => ({
        ...repuesto,
          categoria: categorias.find(categoria => categoria.categoria_id === repuesto.categoria_id)
        }));
      }));
  }

  getRepuestoById(id: number): Observable<IRepuesto> {
    return this.http.get<IRepuesto>(`${this.urlRepuesto}/${id}`);
  }

  postRepuestos(repuesto: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });

    return this.http.post<any>(`${this.urlRepuesto}`, repuesto , { headers });
  }

  deleteRepuesto(id: number): Observable<any> {
    return this.http.delete<number>(`${this.urlRepuesto}/${id}`)
  }

  putRepuesto(formData: FormData, id: number): Observable<IRepuesto> {
    return this.http.put<IRepuesto>(`${this.urlRepuesto}/${id}`, formData);
  }
}
