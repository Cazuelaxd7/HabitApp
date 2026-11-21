import { Injectable } from '@angular/core';
import {
  Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, User, onAuthStateChanged, updateProfile, sendPasswordResetEmail,
  setPersistence, inMemoryPersistence
} from 'firebase/auth';
import { firebaseApp } from './firebase';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = getAuth(firebaseApp);
  private userSubject = new BehaviorSubject<User | null | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  constructor() {
    // La sesion vive solo en memoria: al recargar o reiniciar "ionic serve"
    // siempre se vuelve al login.
    setPersistence(this.auth, inMemoryPersistence).catch(e => console.error(e));
    onAuthStateChanged(this.auth, (user) => this.userSubject.next(user));
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string, nombre: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(cred.user, { displayName: nombre });
    this.userSubject.next(cred.user);
    return cred;
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  waitForAuthState(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(this.auth, (user) => {
        unsub();
        resolve(user);
      });
    });
  }
}
