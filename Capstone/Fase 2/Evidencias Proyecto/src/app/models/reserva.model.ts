export type EstadoReserva = 'upcoming' | 'completed' | 'cancelled';

export interface EspacioInfo {
  nombre: string;
  icono: string;
  tipo: 'quincho' | 'salon' | 'court';
  capacidad: number;
  horarios: string[];
}

export interface Reserva {
  id: string;
  uid: string;
  espacio: string;
  fecha: string;
  horario: string;
  estado: EstadoReserva;
}

export const ESPACIOS: EspacioInfo[] = [
  {
    nombre: 'Quincho 1', icono: '🏡', tipo: 'quincho', capacidad: 20,
    horarios: ['12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'],
  },
  {
    nombre: 'Quincho 2', icono: '🏡', tipo: 'quincho', capacidad: 20,
    horarios: ['12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'],
  },
  {
    nombre: 'Salón Multiuso 1', icono: '🏢', tipo: 'salon', capacidad: 30,
    horarios: ['10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'],
  },
  {
    nombre: 'Salón Multiuso 2', icono: '🏢', tipo: 'salon', capacidad: 40,
    horarios: ['12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'],
  },
  {
    nombre: 'Cancha', icono: '⚽', tipo: 'court', capacidad: 12,
    horarios: ['10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'],
  },
];

export const DEMO_OCUPADOS: Record<string, Record<string, string[]>> = {
  '2026-09-27': {
    'Quincho 1': ['15:00 - 16:00', '19:00 - 20:00'],
    'Quincho 2': ['18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'],
    'Salón Multiuso 1': ['13:00 - 14:00', '16:00 - 17:00', '20:00 - 21:00'],
    'Salón Multiuso 2': ['14:00 - 15:00', '18:00 - 19:00'],
    'Cancha': ['11:00 - 12:00', '16:00 - 17:00'],
  },
  '2026-09-28': {
    'Quincho 1': ['16:00 - 17:00'],
    'Quincho 2': ['15:00 - 16:00', '17:00 - 18:00'],
    'Salón Multiuso 1': ['10:00 - 11:00', '14:00 - 15:00', '18:00 - 19:00'],
    'Salón Multiuso 2': ['13:00 - 14:00', '19:00 - 20:00'],
    'Cancha': ['12:00 - 13:00', '15:00 - 16:00'],
  },
  '2026-09-29': {
    'Quincho 1': ['13:00 - 14:00', '18:00 - 19:00'],
    'Quincho 2': ['14:00 - 15:00'],
    'Salón Multiuso 1': ['11:00 - 12:00', '15:00 - 16:00', '21:00 - 22:00'],
    'Salón Multiuso 2': ['16:00 - 17:00'],
    'Cancha': ['10:00 - 11:00', '14:00 - 15:00', '17:00 - 18:00'],
  },
};
