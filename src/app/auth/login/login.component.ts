import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'app/core/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMsg: string | null = null;
  loading = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      user_correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMsg = null;

    const { user_correo, password } = this.loginForm.value;

    this.userService.login(user_correo, password).subscribe({
      next: () => {
        this.router.navigate(['/admin/inicio']); // Cambia a tu ruta deseada
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error de autenticación';
        this.loading = false;
      }
    });
  }

}
