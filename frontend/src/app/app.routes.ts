// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.LoginComponent),
  },

  // ============================================
  // FLUJO DEL REPARTIDOR
  // ============================================
  {
    path: 'repartidor',
    canActivate: [authGuard],
    data: { role: 'repartidor' },
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'pedido/:id',
        loadComponent: () =>
          import('./pages/pedido-detalle/pedido-detalle.component').then(
            (m) => m.PedidoDetalleComponent
          ),
      },
      {
        path: 'mis-pedidos',
        loadComponent: () =>
          import('./pages/mis-pedidos/mis-pedidos.component').then(
            (m) => m.MisPedidosComponent
          ),
      },
      // TODO: Agregar más rutas del flujo del repartidor
      // - Confirmar pedido
      // - Pantalla de entrega
      // - Pedido en camino
      // - Pedido entregado
    ],
  },

  // ============================================
  // FLUJO DEL VENDEDOR (Por implementar)
  // ============================================
  {
    path: 'vendedor',
    children: [
      // TODO: Implementar rutas del vendedor
    ],
  },

  // ============================================
  // FLUJO DEL CLIENTE (Por implementar)
  // ============================================
  {
    path: 'cliente',
    children: [
      // TODO: Implementar rutas del cliente
    ],
  },

  // Ruta de respaldo
  {
    path: '**',
    redirectTo: '/login',
  },
];
