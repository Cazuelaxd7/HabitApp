import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, ToastController } from '@ionic/angular';
import { Unsubscribe } from 'firebase/firestore';
import { AuthService } from '../../core/auth.service';
import { PagosService } from '../../services/pagos.service';
import { Pago, PagoPendiente } from '../../models/pago.model';

@Component({
  selector: 'app-pagos',
  standalone: true,
  templateUrl: './pagos.page.html',
  styleUrls: ['./pagos.page.scss'],
  imports: [CommonModule, IonContent],
})
export class PagosPage implements OnInit, OnDestroy {
  pendiente: PagoPendiente | null = {
    mes: 'Septiembre 2026',
    vencimiento: '30 de septiembre',
    desglose: [
      { concepto: 'Gastos comunes', monto: 40000 },
      { concepto: 'Fondo de reserva', monto: 5000 },
    ],
    total: 45000,
  };

  historial: Pago[] = [];

  modalAbierto = false;
  procesando = false;
  comprobanteGenerado: string | null = null;
  metodoSeleccionado: string | null = null;

  /**
   * Copia congelada de "pendiente" tomada en el momento de abrir el modal.
   * Evita que el monto se vea afectado si "pendiente" cambia a null mientras
   * el modal sigue abierto (por ejemplo, si el listener de historial se
   * actualiza en tiempo real justo durante el flujo de pago).
   */
  pagoEnProceso: PagoPendiente | null = null;

  private uid = '';
  private unsubscribe: Unsubscribe | null = null;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private pagosService: PagosService
  ) {}

  ngOnInit() {
    this.uid = this.authService.getCurrentUser()?.uid || '';
    if (!this.uid) return;

    this.unsubscribe = this.pagosService.escucharHistorial(this.uid, (pagos) => {
      this.historial = pagos;
      const yaPagoEsteMes = this.historial.some(h => h.mes === this.pendiente?.mes);
      if (yaPagoEsteMes) this.pendiente = null;
    });
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }

  goBack() {
    this.router.navigateByUrl('/tabs/home');
  }

  formatMonto(valor: number): string {
    return valor.toLocaleString('es-CL');
  }

  abrirModalPago() {
    if (!this.pendiente) return;

    // Congelamos el pago que se está pagando para que el modal no dependa
    // de "pendiente" cambiando en tiempo real mientras está abierto.
    this.pagoEnProceso = { ...this.pendiente };

    this.modalAbierto = true;
    this.metodoSeleccionado = null;
    this.comprobanteGenerado = null;
    this.procesando = false;
  }

  cerrarModal() {
    if (this.procesando) return;
    this.modalAbierto = false;
    this.metodoSeleccionado = null;
    this.comprobanteGenerado = null;
    this.pagoEnProceso = null;
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }

  async confirmarPago() {
    if (!this.metodoSeleccionado || !this.pagoEnProceso || !this.uid) return;

    this.procesando = true;
    const pago = this.pagoEnProceso;

    try {
      const comprobante = await this.pagosService.registrarPago(this.uid, {
        concepto: 'Gastos comunes',
        mes: pago.mes,
        monto: pago.total,
        metodo: this.metodoSeleccionado,
      });

      // Pequeña espera artificial para que se sienta el estado "procesando" (mejor UX)
      setTimeout(() => {
        this.procesando = false;
        this.comprobanteGenerado = comprobante;
      }, 1100);
    } catch (error) {
      this.procesando = false;
      const toast = await this.toastCtrl.create({ message: 'Error al procesar el pago', duration: 2200, color: 'danger' });
      await toast.present();
    }
  }
}
