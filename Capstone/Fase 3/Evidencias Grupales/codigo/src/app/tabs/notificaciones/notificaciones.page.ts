import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class NotificacionesPage {}