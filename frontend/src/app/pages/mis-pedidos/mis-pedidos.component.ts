// src/app/pages/mis-pedidos/mis-pedidos.component.ts
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-screen w-full bg-black text-white">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 bg-gray-900/50 border-b border-gray-700 backdrop-blur-md p-4"
      >
        <div class="flex items-center justify-between">
          <h1 class="font-cinzel text-2xl font-bold text-glow">
            Mis Pedidos Actuales
          </h1>
          <button
            (click)="volverAlHome()"
            class="text-gray-400 hover:text-white transition-colors"
            title="Volver al inicio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Loading State -->
      <div
        *ngIf="isLoading()"
        class="flex items-center justify-center flex-1"
      >
        <div class="flex flex-col items-center space-y-4">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"
          ></div>
          <p class="text-gray-400">Cargando pedidos...</p>
        </div>
      </div>

      <!-- Content -->
      <div *ngIf="!isLoading()" class="flex-1 overflow-y-auto pb-20">
        <!-- Empty State -->
        <div
          *ngIf="pedidos().length === 0"
          class="flex flex-col items-center justify-center h-full px-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-600 mb-4"
          >
            <path
              d="m7.5 4.27 9 5.15"
            />
            <path
              d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
            />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
          <h2 class="font-cinzel text-xl font-bold text-gray-300 mb-2">
            No tienes pedidos activos
          </h2>
          <p class="text-gray-500 text-center mb-6">
            Acepta pedidos desde el feed principal para comenzar a entregar
          </p>
          <button
            (click)="volverAlHome()"
            class="hollow-btn bg-cyan-500/20 text-cyan-400 border border-cyan-400 px-6 py-3 rounded-lg
                   hover:bg-cyan-500/30 transition-all duration-300"
          >
            Ver Pedidos Disponibles
          </button>
        </div>

        <!-- Lista de Pedidos -->
        <div *ngIf="pedidos().length > 0" class="p-4 space-y-4">
          <!-- Tabs de Estado -->
          <div class="flex space-x-2 overflow-x-auto pb-2">
            <button
              *ngFor="let estado of estadosDisponibles"
              (click)="filtroEstado.set(estado)"
              [class.active]="filtroEstado() === estado"
              class="tab-btn px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300
                     border border-gray-700 text-gray-400
                     hover:border-cyan-400 hover:text-cyan-400"
              [class.border-cyan-400]="filtroEstado() === estado"
              [class.bg-cyan-500/20]="filtroEstado() === estado"
              [class.text-cyan-400]="filtroEstado() === estado"
            >
              {{ obtenerNombreEstado(estado) }}
              <span
                class="ml-2 px-2 py-0.5 rounded-full text-xs"
                [class.bg-cyan-500/30]="filtroEstado() === estado"
                [class.bg-gray-700]="filtroEstado() !== estado"
              >
                {{ contarPorEstado(estado) }}
              </span>
            </button>
          </div>

          <!-- Pedidos Filtrados -->
          <div class="space-y-4">
            <div
              *ngFor="let pedido of pedidosFiltrados()"
              (click)="verDetalle(pedido.id)"
              (keydown.enter)="verDetalle(pedido.id)"
              (keydown.space)="verDetalle(pedido.id)"
              tabindex="0"
              role="button"
              class="hollow-card bg-gray-800/50 border border-gray-700 rounded-lg p-4
                     backdrop-blur-sm shadow-lg transition-all duration-300
                     hover:border-cyan-400 hover:shadow-cyan-400/20 cursor-pointer"
            >
              <!-- Estado Badge -->
              <div class="flex items-center justify-between mb-3">
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold"
                  [ngClass]="obtenerClaseEstado(pedido.estado)"
                >
                  {{ obtenerTextoEstado(pedido.estado) }}
                </span>
                <span class="text-xs text-gray-500">
                  Pedido #{{ pedido.id }}
                </span>
              </div>

              <!-- Negocio -->
              <h3 class="font-cinzel text-xl font-bold text-white text-glow mb-1">
                {{ pedido.negocio }}
              </h3>
              <p class="text-sm text-gray-400 mb-3">
                {{ pedido.direccionRecogida }}
              </p>

              <!-- Cliente -->
              <div
                *ngIf="pedido.cliente"
                class="flex items-center space-x-2 mb-3 text-sm text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-cyan-400"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{{ pedido.cliente.nombre }}</span>
              </div>

              <!-- Dirección de Entrega -->
              <div class="flex items-start space-x-2 mb-3 text-sm text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-green-400 mt-0.5 flex-shrink-0"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{{ pedido.direccionEntrega }}</span>
              </div>

              <!-- Detalles del Pedido -->
              <div class="flex justify-between items-center text-gray-300 pt-3 border-t border-gray-700">
                <div class="flex items-center space-x-1" title="Recompensa (Geo)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-yellow-400"
                  >
                    <circle cx="8" cy="8" r="6" />
                    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
                    <path d="M7 6h1v4" />
                    <path d="m16.71 13.88.7.71-2.82 2.82" />
                  </svg>
                  <span class="font-bold text-lg text-white">{{
                    pedido.recompensa
                  }}</span>
                  <span class="text-sm">Geo</span>
                </div>

                <div class="flex items-center space-x-1" title="Distancia">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{{ pedido.distancia }} km</span>
                </div>

                <div class="flex items-center space-x-1" title="Items">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m7.5 4.27 9 5.15" />
                    <path
                      d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
                    />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                  <span>{{ pedido.items }}</span>
                </div>
              </div>

              <!-- Botones de Acción según Estado -->
              <div *ngIf="pedido.estado === 'aceptado'" class="mt-4 pt-4 border-t border-gray-700">
                <button
                  (click)="iniciarEntrega($event, pedido.id)"
                  class="w-full hollow-btn bg-cyan-500/20 text-cyan-400 border border-cyan-400 px-4 py-2 rounded-lg
                         hover:bg-cyan-500/30 transition-all duration-300"
                >
                  Iniciar Entrega
                </button>
              </div>

              <div *ngIf="pedido.estado === 'en-camino'" class="mt-4 pt-4 border-t border-gray-700">
                <button
                  (click)="confirmarEntrega($event, pedido.id)"
                  class="w-full hollow-btn bg-green-500/20 text-green-400 border border-green-400 px-4 py-2 rounded-lg
                         hover:bg-green-500/30 transition-all duration-300"
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Navigation -->
      <footer
        class="sticky bottom-0 z-10 w-full border-t border-gray-700 bg-gray-900/50 backdrop-blur-md
               flex h-16 justify-around"
      >
        <button (click)="volverAlHome()" class="hollow-nav-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span class="text-xs">Inicio</span>
        </button>

        <button class="hollow-nav-btn active">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
          <span class="text-xs">Mis Pedidos</span>
        </button>

        <button class="hollow-nav-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span class="text-xs">Perfil</span>
        </button>
      </footer>
    </div>
  `,
  styles: [
    `
      .text-glow {
        text-shadow: 0 0 5px #fff, 0 0 10px #c0c0c0;
      }

      .hollow-card {
        transition: all 0.3s ease-out;
      }

      .hollow-btn {
        transition: all 0.2s ease;
      }

      .hollow-nav-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        color: #6b7280;
        transition: all 0.2s ease;
      }

      .hollow-nav-btn:hover {
        color: #22d3ee;
      }

      .hollow-nav-btn.active {
        color: #22d3ee;
      }

      .tab-btn {
        transition: all 0.3s ease;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisPedidosComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals
  pedidos = signal<Pedido[]>([]);
  isLoading = signal(true);
  filtroEstado = signal<
    'todos' | 'aceptado' | 'en-camino' | 'entregado'
  >('todos');

  estadosDisponibles: ('todos' | 'aceptado' | 'en-camino' | 'entregado')[] =
    ['todos', 'aceptado', 'en-camino', 'entregado'];

  ngOnInit(): void {
    this.cargarMisPedidos();
  }

  cargarMisPedidos(): void {
    this.isLoading.set(true);
    // Obtener pedidos del repartidor actual (filtrados por estado != 'disponible')
    this.pedidoService.getMisPedidos().subscribe({
      next: (pedidos: Pedido[]) => {
        this.pedidos.set(pedidos);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('Error al cargar mis pedidos:', error);
        this.isLoading.set(false);
      },
    });
  }

  pedidosFiltrados(): Pedido[] {
    const filtro = this.filtroEstado();
    if (filtro === 'todos') {
      return this.pedidos();
    }
    return this.pedidos().filter((p) => p.estado === filtro);
  }

  contarPorEstado(estado: 'todos' | 'aceptado' | 'en-camino' | 'entregado'): number {
    if (estado === 'todos') {
      return this.pedidos().length;
    }
    return this.pedidos().filter((p) => p.estado === estado).length;
  }

  obtenerNombreEstado(estado: 'todos' | 'aceptado' | 'en-camino' | 'entregado'): string {
    const nombres = {
      todos: 'Todos',
      aceptado: 'Aceptados',
      'en-camino': 'En Camino',
      entregado: 'Entregados',
    };
    return nombres[estado];
  }

  obtenerClaseEstado(estado: string): string {
    const clases: Record<string, string> = {
      aceptado: 'bg-blue-500/20 text-blue-400 border border-blue-400/50',
      'en-camino': 'bg-purple-500/20 text-purple-400 border border-purple-400/50',
      entregado: 'bg-green-500/20 text-green-400 border border-green-400/50',
    };
    return clases[estado] || 'bg-gray-500/20 text-gray-400';
  }

  obtenerTextoEstado(estado: string): string {
    const textos: Record<string, string> = {
      aceptado: 'Aceptado',
      'en-camino': 'En Camino',
      entregado: 'Entregado',
    };
    return textos[estado] || estado;
  }

  verDetalle(pedidoId: string): void {
    this.router.navigate(['/repartidor/pedido', pedidoId]);
  }

  iniciarEntrega(event: Event, pedidoId: string): void {
    event.stopPropagation();
    this.pedidoService.actualizarEstadoPedido(pedidoId, 'en-camino').subscribe({
      next: () => {
        // Recargar pedidos
        this.cargarMisPedidos();
        // TODO: Navegar a la pantalla de entrega con mapa
        console.log('Entrega iniciada para pedido:', pedidoId);
      },
      error: (error) => {
        console.error('Error al iniciar entrega:', error);
      },
    });
  }

  confirmarEntrega(event: Event, pedidoId: string): void {
    event.stopPropagation();
    this.pedidoService.actualizarEstadoPedido(pedidoId, 'entregado').subscribe({
      next: () => {
        // Recargar pedidos
        this.cargarMisPedidos();
        // TODO: Mostrar pantalla de confirmación/calificación
        console.log('Entrega confirmada para pedido:', pedidoId);
      },
      error: (error) => {
        console.error('Error al confirmar entrega:', error);
      },
    });
  }

  volverAlHome(): void {
    this.router.navigate(['/repartidor/home']);
  }
}
