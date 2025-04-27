import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Extraemos el payload del token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload?.role;

      if (role === 'user') {
        return true; // Solo deja pasar si es admin
      } else {
        this.router.navigate(['/unauthorized']); // o donde quieras enviar a no-admins
        return false;
      }

    } catch (error) {
      console.error('Error decoding token', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
