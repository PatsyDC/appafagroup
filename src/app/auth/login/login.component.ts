import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.authService.login(this.username, this.password)) {
      // Add a simple visual effect on successful login
      const formElement = document.querySelector('.login-form');
      if (formElement) {
        formElement.classList.add('success');
        setTimeout(() => {
          this.router.navigate(['/admin/inicio']);
        }, 1000);
      }
    } else {
      alert('Invalid credentials');
    }
  }
}
