import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, AlertController } from '@ionic/angular';
import { Unsubscribe } from 'firebase/firestore';
import { AuthService } from '../../core/auth.service';
import { ReservasService } from '../../services/reservas.service';
import { PagosService } from '../../services/pagos.service';

interface Actividad {
  tipo: 'reserva' | 'pago';
  titulo: string;
  detalle: string;
  ts: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonContent],
})
export class HomePage implements OnInit, OnDestroy {
  userName = '';
  habitantes = 3;

  proxima: any = null;
  actividad: Actividad[] = [];

  private reservasAct: Actividad[] = [];
  private pagosAct: Actividad[] = [];
  private unsubs: Unsubscribe[] = [];

  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService,
    private reservasService: ReservasService,
    private pagosService: PagosService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.userName = user?.displayName || user?.email || 'Usuario';
    const uid = user?.uid;
    if (!uid) return;

    this.unsubs.push(
      this.reservasService.escucharMisReservas(uid, (reservas) => {
        const items = reservas.map((r: any) => ({
          r,
          ts: r.createdAt?.toMillis?.() ?? Date.now(),
        }));
        items.sort((a, b) => b.ts - a.ts);
        this.proxima = items[0]?.r ?? null;
        this.reservasAct = items.map(({ r, ts }) => ({
          tipo: 'reserva' as const,
          titulo: 'Reserva creada',
          detalle: `${r.espacio} \u00B7 ${r.fecha} \u00B7 ${r.horario}`,
          ts,
        }));
        this.reconstruir();
      })
    );

    this.unsubs.push(
      this.pagosService.escucharHistorial(uid, (pagos) => {
        this.pagosAct = pagos.map((p: any) => ({
          tipo: 'pago' as const,
          titulo: 'Pago recibido',
          detalle: `${p.concepto} \u00B7 ${p.mes}`,
          ts: p.createdAt || 0,
        }));
        this.reconstruir();
      })
    );
  }

  ngOnDestroy() {
    this.unsubs.forEach(u => u());
  }

  private reconstruir() {
    this.actividad = [...this.reservasAct, ...this.pagosAct]
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 4);
  }

  get primerNombre(): string {
    return this.userName.split(' ')[0].split('@')[0];
  }

  get iniciales(): string {
    const partes = this.userName.replace(/@.*/, '').trim().split(' ');
    const primera = partes[0]?.[0] || 'U';
    const segunda = partes[1]?.[0] || '';
    return (primera + segunda).toUpperCase();
  }

  get saludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'BUENOS D\u00CDAS';
    if (hora < 19) return 'BUENAS TARDES';
    return 'BUENAS NOCHES';
  }

  goToPagos() { this.router.navigateByUrl('/tabs/pagos'); }
  goToComunidad() { this.router.navigateByUrl('/tabs/comunidad'); }
  goToNotificaciones() { this.router.navigateByUrl('/tabs/notificaciones'); }
  showReservas() { this.router.navigateByUrl('/tabs/reservas'); }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesi\u00F3n',
      message: '\u00BFSeguro que quieres salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: async () => {
            await this.authService.logout();
            this.router.navigateByUrl('/login');
          },
        },
      ],
    });
    await alert.present();
  }

  async showMultas() {
    const alert = await this.alertCtrl.create({
      header: 'Multas pendientes',
      message: 'No tienes multas registradas en este momento.',
      buttons: ['Cerrar'],
    });
    await alert.present();
  }
}
