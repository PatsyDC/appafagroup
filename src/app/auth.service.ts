import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated: boolean = false;
  private registeredUsers: { username: string, password: string }[] = []; // Array para almacenar los usuarios registrados

  constructor() {
    // Recuperar los usuarios registrados del almacenamiento local al inicializar el servicio
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      this.registeredUsers = JSON.parse(storedUsers);
    }
  }

  login(username: string, password: string): boolean {
    // Aquí iría la lógica de autenticación real, por ejemplo, llamada a una API.
    if (username === 'adminafa' && password === 'adminafa') {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }



}

