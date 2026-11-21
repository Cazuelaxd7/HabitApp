import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, FormsModule, IonContent],
})
export class RegisterPage {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  cargando = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async onSubmit() {
    this.errorMessage = '';

    if (!this.nombre.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    try {
      await this.authService.register(this.email.trim(), this.password, this.nombre.trim());
      this.router.navigateByUrl('/tabs/home');
    } catch (error: any) {
      this.errorMessage = this.mapFirebaseError(error?.code);
    } finally {
      this.cargando = false;
    }
  }

  private mapFirebaseError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ese correo ya está registrado.';
      case 'auth/invalid-email':
        return 'El correo ingresado no es válido.';
      case 'auth/weak-password':
        return 'La contraseña es muy débil.';
      default:
        return 'No se pudo crear la cuenta. Intenta nuevamente.';
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
