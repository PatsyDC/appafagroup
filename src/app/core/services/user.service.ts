import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { LoginResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/v1/';

  constructor(private http: HttpClient) { }

  login(user_correo: string, password: string): Observable<LoginResponse> {
    const body = { user_correo, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}login`, body).pipe(
      tap((res) => {
        // Aquí guardas el usuario y token por separado
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload); //verificar estructura del token
        return payload.user_id || payload.id || null; // Ajusta según tu backend
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }

  getAllUsers(): Observable<any[]> {
    const token = this.getToken();

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get<any>(`${this.apiUrl}usuarios`, { headers }).pipe(
      tap((res) => console.log('Usuarios recibidos:', res)),
      map(res => res.body)
    );
  }


}
