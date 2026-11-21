import { Injectable } from '@angular/core';
import {
  collection, addDoc, updateDoc, doc, onSnapshot, query, where,
  serverTimestamp, Unsubscribe
} from 'firebase/firestore';
import { db } from '../core/firestore';
import { Reserva } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservasService {

  escucharReservasEspacio(espacio: string, callback: (reservas: Reserva[]) => void): Unsubscribe {
    const q = query(
      collection(db, 'reservas'),
      where('espacio', '==', espacio),
      where('estado', '==', 'upcoming')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
  }

  escucharMisReservas(uid: string, callback: (reservas: Reserva[]) => void): Unsubscribe {
    const q = query(
      collection(db, 'reservas'),
      where('uid', '==', uid),
      where('estado', '==', 'upcoming')
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
  }

  escucharHistorial(uid: string, callback: (reservas: Reserva[]) => void): Unsubscribe {
    const q = query(
      collection(db, 'reservas'),
      where('uid', '==', uid),
      where('estado', 'in', ['completed', 'cancelled'])
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
  }

  async crearReserva(uid: string, espacio: string, fecha: string, horario: string): Promise<void> {
    await addDoc(collection(db, 'reservas'), {
      uid, espacio, fecha, horario, estado: 'upcoming', createdAt: serverTimestamp(),
    });
  }

  async cancelarReserva(id: string): Promise<void> {
    await updateDoc(doc(db, 'reservas', id), { estado: 'cancelled' });
  }
}