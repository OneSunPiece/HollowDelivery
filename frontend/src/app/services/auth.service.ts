// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';

export type UserRole = 'repartidor' | 'vendedor' | 'cliente' | null;

export interface User {
  email: string;
  role: UserRole;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal para el usuario actual
  private currentUser = signal<User | null>(null);

  // Exponer como readonly
  readonly user = this.currentUser.asReadonly();

  // Verificar si el usuario está autenticado
  get isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  // Obtener el rol del usuario
  get userRole(): UserRole {
    return this.currentUser()?.role ?? null;
  }

  // Login (por ahora basado en email)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(email: string, _password: string): boolean {
    // TODO: Validar con backend real
    const role = this.determineRoleFromEmail(email);

    this.currentUser.set({
      email,
      role,
      name: this.extractNameFromEmail(email),
    });

    // Guardar en localStorage para persistencia
    localStorage.setItem('user', JSON.stringify(this.currentUser()));

    return true;
  }

  // Logout
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  // Restaurar sesión desde localStorage
  restoreSession(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.currentUser.set(user);
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        localStorage.removeItem('user');
      }
    }
  }

  // Determinar rol basado en el email
  private determineRoleFromEmail(email: string): UserRole {
    const emailLower = email.toLowerCase();

    if (
      emailLower.includes('repartidor') ||
      emailLower.includes('delivery') ||
      emailLower.includes('courier')
    ) {
      return 'repartidor';
    } else if (
      emailLower.includes('vendedor') ||
      emailLower.includes('seller') ||
      emailLower.includes('negocio') ||
      emailLower.includes('business')
    ) {
      return 'vendedor';
    } else {
      return 'cliente';
    }
  }

  // Extraer nombre del email (simple)
  private extractNameFromEmail(email: string): string {
    return email.split('@')[0].replace(/[._-]/g, ' ');
  }
}
