import { Component } from '@angular/core';
import { 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonDatetime, 
  IonList, 
  IonItem, 
  IonSelect, 
  IonSelectOption, 
  IonButton 
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonDatetime, 
    IonList, 
    IonItem, 
    IonSelect, 
    IonSelectOption, 
    IonButton
  ]
})
export class HomePage {
  constructor() {}
}