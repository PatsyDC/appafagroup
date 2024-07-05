import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Inoticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  private _refresh$ = new Subject<void>();
  get refresh$() {
    return this._refresh$;
  }

  private urlNoticias: string = 'http://localhost:3000/noticias';

  constructor(private http: HttpClient) {}

  allNoticias(): Observable<Inoticia[]> {
    return this.http.get<Inoticia[]>(this.urlNoticias);
  }

  getNoticiaById(id: number): Observable<Inoticia> {
    return this.http.get<Inoticia>(`${this.urlNoticias}/${id}`);
  }

  postNoticia(noticia: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });

    return this.http.post<any>(`${this.urlNoticias}`, noticia, { headers });
  }

  deleteNoticia(id: number): Observable<any> {
    return this.http.delete<number>(`${this.urlNoticias}/${id}`);
  }

  putNoticia(formData: FormData, id: number): Observable<Inoticia> {
    return this.http.put<Inoticia>(`${this.urlNoticias}/${id}`, formData);
  }

}
