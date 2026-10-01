import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, ToastController } from '@ionic/angular';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../../core/firestore';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [IonContent, FormsModule],
})
export class PerfilPage implements OnInit {
  uid = '';
  correo = '';
  rol = 'Residente';

  nombre = '';
  departamento = '';
  condominio = '';
  telefono = '';

  editando = false;
  guardando = false;
  private copia: any = null;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const user: any = this.authService.getCurrentUser();
    if (!user) return;

    this.uid = user.uid;
    this.correo = user.email || '';
    this.nombre = user.displayName || '';

    try {
      const snap = await getDoc(doc(db, 'usuarios', this.uid));
      if (snap.exists()) {
        const d: any = snap.data();
        this.nombre = d.nombre || this.nombre;
        this.departamento = d.departamento || '';
        this.condominio = d.condominio || '';
        this.telefono = d.telefono || '';
      }
    } catch (e) {
      console.error('Error cargando perfil', e);
    }
  }

  get nombreMostrado(): string {
    return this.nombre || this.correo.split('@')[0] || 'Usuario';
  }

  get iniciales(): string {
    const partes = this.nombreMostrado.trim().split(/\s+/);
    return ((partes[0]?.[0] || 'U') + (partes[1]?.[0] || '')).toUpperCase();
  }

  editar() {
    this.copia = {
      nombre: this.nombre,
      departamento: this.departamento,
      condominio: this.condominio,
      telefono: this.telefono,
    };
    this.editando = true;
  }

  cancelar() {
    if (this.copia) Object.assign(this, this.copia);
    this.editando = false;
  }

  async guardar() {
    if (!this.uid || this.guardando) return;
    this.guardando = true;
    try {
      await setDoc(
        doc(db, 'usuarios', this.uid),
        {
          nombre: this.nombre.trim(),
          departamento: this.departamento.trim(),
          condominio: this.condominio.trim(),
          telefono: this.telefono.trim(),
        },
        { merge: true }
      );

      const user: any = this.authService.getCurrentUser();
      if (user && this.nombre.trim()) {
        await updateProfile(user, { displayName: this.nombre.trim() });
      }

      this.editando = false;
      await this.toast('Perfil actualizado', 'success');
    } catch (e) {
      console.error(e);
      await this.toast('No se pudo guardar', 'danger');
    } finally {
      this.guardando = false;
    }
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  private async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2000, color });
    await t.present();
  }
}
