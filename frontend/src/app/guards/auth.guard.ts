// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (!authService.isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar el rol si la ruta lo requiere
  const requiredRole = route.data['role'] as string | undefined;
  if (requiredRole && authService.userRole !== requiredRole) {
    // Redirigir al home correspondiente según el rol del usuario
    switch (authService.userRole) {
      case 'repartidor':
        router.navigate(['/repartidor/home']);
        break;
      case 'vendedor':
        router.navigate(['/vendedor/home']);
        break;
      case 'cliente':
        router.navigate(['/cliente/home']);
        break;
      default:
        router.navigate(['/login']);
    }
    return false;
  }

  return true;
};
