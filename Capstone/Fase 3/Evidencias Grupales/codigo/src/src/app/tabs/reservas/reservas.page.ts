import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, ToastController } from '@ionic/angular';
import { Unsubscribe } from 'firebase/firestore';
import { AuthService } from '../../core/auth.service';
import { ReservasService } from '../../services/reservas.service';
import { Reserva, EspacioInfo, ESPACIOS, DEMO_OCUPADOS } from '../../models/reserva.model';

const DIAS_SEMANA = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const DIAS_LARGO = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

interface DiaCalendario {
  fecha: Date; fechaStr: string; weekday: string; numero: number;
  esHoy: boolean; esPasado: boolean; tieneReserva: boolean;
}

interface EspacioCard extends EspacioInfo {
  disponibles: string[];
  completo: boolean;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  imports: [CommonModule, IonContent],
})
export class ReservasPage implements OnInit, OnDestroy {
  espacios = ESPACIOS;
  calendarStartDate = new Date();
  selectedDate = new Date();
  diasCalendario: DiaCalendario[] = [];
  espaciosCards: EspacioCard[] = [];

  misReservas: Reserva[] = [];
  historial: Reserva[] = [];

  modalAbierto: 'nueva' | 'detalle' | null = null;
  espacioModal: EspacioInfo | null = null;
  horarioSeleccionadoModal: string | null = null;
  reservaDetalle: Reserva | null = null;

  private uid = '';
  private reservasPorEspacio: Record<string, Reserva[]> = {};
  private unsubs: Unsubscribe[] = [];

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private reservasService: ReservasService
  ) {}

  ngOnInit() {
    this.uid = this.authService.getCurrentUser()?.uid || '';

    this.espacios.forEach(esp => {
      const unsub = this.reservasService.escucharReservasEspacio(esp.nombre, (reservas) => {
        this.reservasPorEspacio[esp.nombre] = reservas;
        this.recalcular();
      });
      this.unsubs.push(unsub);
    });

    if (this.uid) {
      this.unsubs.push(this.reservasService.escucharMisReservas(this.uid, (r) => {
        this.misReservas = r.sort((a, b) => a.fecha.localeCompare(b.fecha));
        this.recalcularCalendario();
      }));
      this.unsubs.push(this.reservasService.escucharHistorial(this.uid, (r) => {
        this.historial = r.sort((a, b) => b.fecha.localeCompare(a.fecha));
      }));
    }

    this.recalcularCalendario();
    this.recalcular();
  }

  ngOnDestroy() {
    this.unsubs.forEach(u => u());
  }

  private toFechaStr(d: Date): string {
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private addDays(d: Date, n: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }

  private recalcularCalendario() {
    const hoy = this.toFechaStr(new Date());
    const dias: DiaCalendario[] = [];
    for (let i = 0; i < 7; i++) {
      const fecha = this.addDays(this.calendarStartDate, i);
      const fechaStr = this.toFechaStr(fecha);
      dias.push({
        fecha, fechaStr,
        weekday: DIAS_SEMANA[fecha.getDay()],
        numero: fecha.getDate(),
        esHoy: fechaStr === hoy,
        esPasado: fechaStr < hoy,
        tieneReserva: this.misReservas.some(r => r.fecha === fechaStr),
      });
    }
    this.diasCalendario = dias;
  }

  get nombreMesAnio(): string {
    const centro = this.diasCalendario[3]?.fecha || this.calendarStartDate;
    return `${MESES[centro.getMonth()]} ${centro.getFullYear()}`;
  }

  get fechaSeleccionadaLegible(): string {
    const d = this.selectedDate;
    return `${DIAS_LARGO[d.getDay()]} ${d.getDate()}`;
  }

  semanaAnterior() {
    this.calendarStartDate = this.addDays(this.calendarStartDate, -7);
    this.selectedDate = this.addDays(this.selectedDate, -7);
    this.recalcularCalendario();
    this.recalcular();
  }

  semanaSiguiente() {
    this.calendarStartDate = this.addDays(this.calendarStartDate, 7);
    this.selectedDate = this.addDays(this.selectedDate, 7);
    this.recalcularCalendario();
    this.recalcular();
  }

  seleccionarDia(dia: DiaCalendario) {
    if (dia.esPasado) return;
    this.selectedDate = dia.fecha;
    this.recalcular();
  }

  private recalcular() {
    const fechaStr = this.toFechaStr(this.selectedDate);
    this.espaciosCards = this.espacios.map(esp => {
      const ocupadosDemo = DEMO_OCUPADOS[fechaStr]?.[esp.nombre] || [];
      const ocupadosReales = (this.reservasPorEspacio[esp.nombre] || [])
        .filter(r => r.fecha === fechaStr)
        .map(r => r.horario);
      const ocupados = new Set([...ocupadosDemo, ...ocupadosReales]);
      const disponibles = esp.horarios.filter(h => !ocupados.has(h));
      return { ...esp, disponibles, completo: disponibles.length === 0 };
    });
  }

  estaOcupado(espacio: EspacioInfo, horario: string): boolean {
    const card = this.espaciosCards.find(c => c.nombre === espacio.nombre);
    return !!card && !card.disponibles.includes(horario);
  }

  abrirModalReserva(espacio: EspacioInfo) {
    this.espacioModal = espacio;
    this.horarioSeleccionadoModal = null;
    this.modalAbierto = 'nueva';
  }

  seleccionarHorarioModal(horario: string) {
    if (this.estaOcupado(this.espacioModal!, horario)) return;
    this.horarioSeleccionadoModal = horario;
  }

  async confirmarReserva() {
    if (!this.horarioSeleccionadoModal || !this.espacioModal || !this.uid) {
      const toast = await this.toastCtrl.create({ message: 'Selecciona un horario.', duration: 1500, color: 'warning' });
      await toast.present();
      return;
    }
    const fechaStr = this.toFechaStr(this.selectedDate);
    try {
      await this.reservasService.crearReserva(this.uid, this.espacioModal.nombre, fechaStr, this.horarioSeleccionadoModal);
      this.cerrarModal();
      const toast = await this.toastCtrl.create({ message: 'Reserva confirmada correctamente.', duration: 1800, color: 'success' });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: 'Error al crear la reserva.', duration: 1800, color: 'danger' });
      await toast.present();
    }
  }

  abrirDetalle(reserva: Reserva) {
    this.reservaDetalle = reserva;
    this.modalAbierto = 'detalle';
  }

  repetirDesdeDetalle() {
    if (!this.reservaDetalle) return;
    const espacio = this.espacios.find(e => e.nombre === this.reservaDetalle!.espacio);
    if (espacio) this.abrirModalReserva(espacio);
  }

  async cancelarDesdeDetalle() {
    if (!this.reservaDetalle) return;
    try {
      await this.reservasService.cancelarReserva(this.reservaDetalle.id);
      const toast = await this.toastCtrl.create({ message: 'Reserva cancelada.', duration: 1500 });
      await toast.present();
    } catch {
      const toast = await this.toastCtrl.create({ message: 'Error al cancelar.', duration: 1500, color: 'danger' });
      await toast.present();
    }
    this.cerrarModal();
  }

  cerrarModal() {
    this.modalAbierto = null;
    this.espacioModal = null;
    this.horarioSeleccionadoModal = null;
    this.reservaDetalle = null;
  }

  formatFechaLarga(fechaStr: string): string {
    const [y, m, d] = fechaStr.split('-').map(Number);
    const fecha = new Date(y, m - 1, d);
    return `${DIAS_LARGO[fecha.getDay()]} ${d} de ${MESES[m - 1].toLowerCase()}`;
  }

  estadoLabel(estado: string): string {
    return estado === 'cancelled' ? 'CANCELADA' : 'COMPLETADA';
  }

  estadoColor(estado: string): string {
    return estado === 'cancelled' ? '#d84b4b' : '#6e6e73';
  }
}