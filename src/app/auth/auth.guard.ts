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

    try {
      // Puedes usar esto para verificar que el token no esté corrupto
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload?.role;

      // Aquí simplemente permitimos el acceso si hay un rol válido
      if (role === 'admin' || role === 'user') {
        return true;
      } else {
        this.router.navigate(['/unauthorized']);
        return false;
      }

    } catch (error) {
      console.error('Error decoding token', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
