import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IArticulo } from '../models/articulos.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  private apiUrl = 'https://newsapi.org/v2/everything';
  private apiKey = '54d353e151274a0f9e9026cea7ccfcab'; // Coloca tu clave API aquí

  constructor(private http: HttpClient) { }

  getArticulosTesla(): Observable<IArticulo[]> {
    const fromDate = '2024-05-19';
    const sortBy = 'publishedAt';

    const url = `${this.apiUrl}?q=tesla&from=${fromDate}&sortBy=${sortBy}&apiKey=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => response.articles as IArticulo[])
    );
  }
}
