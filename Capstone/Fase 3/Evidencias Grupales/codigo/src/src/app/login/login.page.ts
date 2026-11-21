import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonContent],
})
export class LoginPage {
  email = '';
  password = '';
  cargando = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  async onSubmit() {
    this.errorMessage = '';
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Completa tu correo y contraseña.';
      return;
    }
    this.cargando = true;
    try {
      await this.authService.login(this.email.trim(), this.password);
      this.router.navigateByUrl('/tabs/home');
    } catch (error: any) {
      this.errorMessage = this.mapFirebaseError(error?.code);
    } finally {
      this.cargando = false;
    }
  }

  private mapFirebaseError(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'El correo ingresado no es válido.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.';
      default:
        return 'No se pudo iniciar sesión. Intenta nuevamente.';
    }
  }

  async onForgotPassword() {
    if (!this.email.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'Ingresa tu correo primero para recuperar tu contraseña.',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }
    try {
      await this.authService.resetPassword(this.email.trim());
      const toast = await this.toastCtrl.create({
        message: 'Te enviamos un correo para restablecer tu contraseña.',
        duration: 2500,
        color: 'success',
      });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({
        message: 'No pudimos enviar el correo de recuperación.',
        duration: 2200,
        color: 'danger',
      });
      await toast.present();
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
