import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    IonContent, IonItem, IonLabel, IonInput, IonButton, IonText
} from '@ionic/angular';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonContent, IonItem, IonLabel, IonInput, IonButton, IonText
    ]
})
export class LoginPage {
    form: FormGroup;
    errorMessage = '';
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    async onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.errorMessage = '';
        this.loading = true;
        const { email, password } = this.form.value;

        try {
            await this.authService.login(email, password);
            this.router.navigateByUrl('/home');
        } catch (err: any) {
            this.errorMessage = this.mapError(err.code);
        } finally {
            this.loading = false;
        }
    }

    private mapError(code: string): string {
        switch (code) {
            case 'auth/invalid-email':
                return 'El correo ingresado no es válido.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Correo o contraseña incorrectos.';
            default:
                return 'Ocurrió un error al iniciar sesión. Intenta de nuevo.';
        }
    }
}