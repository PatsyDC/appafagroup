import { HttpClient } from '@angular/common/http';
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
          categoria: categorias.find(categoria => categoria.id === repuesto.categoria_id)
        }));
      }));
  }

  getRepuestoById(id: number): Observable<IRepuesto> {
    return this.http.get<IRepuesto>(`${this.urlRepuesto}/${id}`);
  }
}
