// src/app/pages/home/home.component.ts
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { PedidoCardComponent } from '../../components/pedido-card/pedido-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PedidoCardComponent, RouterLink],
  template: `
    <div class="h-screen w-full flex flex-col bg-black text-white">
      <!-- 1. Barra Superior (Header) -->
      <header
        class="sticky top-0 z-10 w-full bg-gray-900/50 border-b border-gray-700 backdrop-blur-md"
      >
        <nav class="flex items-center justify-between h-16 px-4">
          <!-- Menú (Izquierda) -->
          <button class="p-2 rounded-full hover:bg-gray-700 transition-colors" (click)="logout()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
          </button>

          <!-- Ubicación (Centro) -->
          <div class="flex flex-col items-center">
            <span class="text-xs text-gray-400">Ubicación</span>
            <div class="flex items-center space-x-1 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-400">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Bocasucia</span>
            </div>
          </div>

          <!-- Búsqueda (Derecha) -->
          <button
            (click)="irABuscar()"
            class="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
        </nav>
      </header>

      <!-- 2. Contenido (Feed Principal) -->
      <main class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Saludo al usuario -->
        @if (user()) {
          <div class="text-gray-400 text-sm">
            <span>Hola, <strong class="text-white">{{ user()?.name || user()?.email }}</strong></span>
          </div>
        }

        <h2 class="font-cinzel text-3xl font-bold text-white text-glow">Pedidos Disponibles</h2>

        <!-- Atajos / Categorías (Filtros) -->
        <div class="flex space-x-2">
          <button class="hollow-filter-btn flex-1">Filtros Avanzados</button>
          <button class="hollow-filter-btn flex-1">Ordenar</button>
        </div>

        <!-- Listado de Pedidos Generales -->
        <div class="space-y-3">
          <!-- Estado de Carga -->
          <div *ngIf="isLoading()" class="flex justify-center items-center h-64">
            <div class="loader"></div>
          </div>

          <!-- Lista de Pedidos -->
          <app-pedido-card *ngFor="let p of pedidos()" [pedido]="p" />

          <!-- Estado Vacío -->
          <div
            *ngIf="!isLoading() && pedidos().length === 0"
            class="flex flex-col items-center justify-center h-64 text-center text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2">
              <line x1="8" x2="21" y1="6" y2="6"/>
              <line x1="8" x2="21" y1="12" y2="12"/>
              <line x1="8" x2="21" y1="18" y2="18"/>
              <line x1="3" x2="3.01" y1="6" y2="6"/>
              <line x1="3" x2="3.01" y1="12" y2="12"/>
              <line x1="3" x2="3.01" y1="18" y2="18"/>
            </svg>
            <p class="font-semibold">Todo en calma en el Nido...</p>
            <p class="text-sm">No hay pedidos disponibles por ahora.</p>
          </div>
        </div>
      </main>

      <!-- 3. Footer (Navegación) -->
      <footer
        class="sticky bottom-0 z-10 w-full bg-gray-900/50 border-t border-gray-700 backdrop-blur-md"
      >
        <nav class="flex justify-around h-16">
          <button type="button" class="hollow-nav-btn active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="text-xs">Home</span>
          </button>
          <button type="button" routerLink="/repartidor/mis-pedidos" class="hollow-nav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" x2="21" y1="6" y2="6"/>
              <line x1="8" x2="21" y1="12" y2="12"/>
              <line x1="8" x2="21" y1="18" y2="18"/>
              <line x1="3" x2="3.01" y1="6" y2="6"/>
              <line x1="3" x2="3.01" y1="12" y2="12"/>
              <line x1="3" x2="3.01" y1="18" y2="18"/>
            </svg>
            <span class="text-xs">Mis Pedidos</span>
          </button>
          <button type="button" class="hollow-nav-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="text-xs">Perfil</span>
          </button>
        </nav>
      </footer>
    </div>
  `,
  styles: [
    `
      .text-glow {
        text-shadow: 0 0 5px #fff, 0 0 10px #c0c0c0;
      }

      .hollow-filter-btn {
        padding: 8px 12px;
        background-color: rgba(107, 114, 128, 0.2); /* bg-gray-500/20 */
        border: 1px solid #4b5563; /* border-gray-600 */
        border-radius: 9999px; /* rounded-full */
        font-size: 0.875rem; /* text-sm */
        color: #d1d5db; /* text-gray-300 */
        transition: all 0.2s ease;
      }
      .hollow-filter-btn:hover {
        background-color: rgba(107, 114, 128, 0.4);
        border-color: #9ca3af; /* border-gray-400 */
      }

      .hollow-nav-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        color: #6b7280; /* text-gray-500 */
        transition: all 0.2s ease;
      }
      .hollow-nav-btn:hover {
        color: #d1d5db; /* text-gray-300 */
      }
      .hollow-nav-btn.active {
        color: #2dd4bf; /* text-teal-400 */
        text-shadow: 0 0 8px #2dd4bf;
      }

      .loader {
        width: 48px;
        height: 48px;
        border: 3px solid #4b5563; /* border-gray-600 */
        border-bottom-color: #fff;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
      }

      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Estado del componente con Signals
  pedidos = signal<Pedido[]>([]);
  isLoading = signal<boolean>(true);

  // Exponer información del usuario
  readonly user = this.authService.user;

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.isLoading.set(true);
    this.pedidoService.getPedidosDisponibles().subscribe((data) => {
      this.pedidos.set(data);
      this.isLoading.set(false);
    });
  }

  irABuscar(): void {
    console.log('Navegar a la pantalla de Búsqueda');
    // TODO: Implementar navegación
    // this.router.navigate(['/repartidor/buscar']);
  }

  irAMisPedidos(): void {
    console.log('Navegando a Mis Pedidos...');
    this.router.navigate(['/repartidor/mis-pedidos']).then(
      (success) => console.log('Navegación exitosa:', success),
      (error) => console.error('Error en navegación:', error)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
