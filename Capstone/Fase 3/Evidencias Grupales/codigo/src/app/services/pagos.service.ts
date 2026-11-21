import { Injectable } from '@angular/core';
import {
  collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Unsubscribe
} from 'firebase/firestore';
import { db } from '../core/firestore';
import { Pago } from '../models/pago.model';

@Injectable({ providedIn: 'root' })
export class PagosService {

  escucharHistorial(uid: string, callback: (pagos: Pago[]) => void): Unsubscribe {
    const q = query(collection(db, 'usuarios', uid, 'pagos'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const pagos: Pago[] = snapshot.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          concepto: data['concepto'],
          mes: data['mes'],
          monto: data['monto'],
          fecha: data['fecha'],
          metodo: data['metodo'],
          comprobante: data['comprobante'],
          createdAt: data['createdAt']?.toMillis?.() ?? Date.now(),
        } as Pago;
      });
      callback(pagos);
    });
  }

  /** Registra el pago en Firestore y devuelve el numero de comprobante generado */
  async registrarPago(uid: string, pago: { concepto: string; mes: string; monto: number; metodo: string }): Promise<string> {
    const comprobante = 'HB-' + Date.now().toString(36).toUpperCase();

    await addDoc(collection(db, 'usuarios', uid, 'pagos'), {
      concepto: pago.concepto,
      mes: pago.mes,
      monto: pago.monto,
      fecha: new Date().toLocaleDateString('es-CL'),
      metodo: pago.metodo,
      comprobante,
      createdAt: serverTimestamp(),
    });

    return comprobante;
  }
}
