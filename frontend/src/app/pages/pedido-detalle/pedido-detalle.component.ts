// src/app/pages/pedido-detalle/pedido-detalle.component.ts
import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Pedido } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-screen w-full flex flex-col bg-black text-white">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 w-full bg-gray-900/50 border-b border-gray-700 backdrop-blur-md"
      >
        <nav class="flex items-center justify-between h-16 px-4">
          <!-- Botón Volver -->
          <button
            (click)="volver()"
            class="p-2 rounded-full hover:bg-gray-700 transition-colors"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <!-- Título -->
          <h1 class="font-cinzel text-lg font-bold">Detalle del Pedido</h1>

          <!-- Espacio vacío para balance -->
          <div class="w-10"></div>
        </nav>
      </header>

      <!-- Contenido Principal -->
      <main class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Estado de Carga -->
        @if (isLoading()) {
        <div class="flex justify-center items-center h-64">
          <div class="loader"></div>
        </div>
        }

        <!-- Pedido No Encontrado -->
        @if (!isLoading() && !pedido()) {
        <div class="flex flex-col items-center justify-center h-64 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mb-4 text-gray-500"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <p class="text-gray-400">Pedido no encontrado</p>
          <button
            (click)="volver()"
            class="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            Volver al inicio
          </button>
        </div>
        }

        <!-- Detalle del Pedido -->
        @if (!isLoading() && pedido()) {
        <!-- ID del Pedido -->
        <div class="text-center">
          <p class="text-xs text-gray-500">Pedido</p>
          <p class="font-mono text-lg text-cyan-400">#{{ pedido()?.id }}</p>
        </div>

        <!-- Información del Negocio -->
        <div
          class="hollow-card bg-gray-800/50 border border-gray-700 rounded-lg p-4"
        >
          <div class="flex items-start space-x-3">
            <div
              class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0"
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
                class="text-cyan-400"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path
                  d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"
                />
                <path d="M12 3v6" />
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="font-cinzel text-xl font-bold text-white text-glow">
                {{ pedido()?.negocioDetalle?.nombre || pedido()?.negocio }}
              </h2>
              <p class="text-sm text-gray-400 mt-1">
                {{ pedido()?.negocioDetalle?.categoria || 'Negocio' }}
              </p>
              <div class="flex items-center space-x-1 text-sm text-gray-400 mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
                <span>{{ pedido()?.direccionRecogida }}</span>
              </div>
              @if (pedido()?.negocioDetalle?.telefono) {
              <div class="flex items-center space-x-1 text-sm text-gray-400 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  />
                </svg>
                <span>{{ pedido()?.negocioDetalle?.telefono }}</span>
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Información del Cliente -->
        <div
          class="hollow-card bg-gray-800/50 border border-gray-700 rounded-lg p-4"
        >
          <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            <span>Cliente</span>
          </h3>
          <div class="space-y-2 text-sm">
            <p class="text-white font-medium">
              {{ pedido()?.cliente?.nombre || 'Cliente' }}
            </p>
            @if (pedido()?.cliente?.telefono) {
            <p class="text-gray-400">📞 {{ pedido()?.cliente?.telefono }}</p>
            }
            <div class="flex items-start space-x-2 text-gray-400">
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
                class="mt-0.5 flex-shrink-0"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ pedido()?.direccionEntrega }}</span>
            </div>
          </div>
        </div>

        <!-- Productos del Pedido -->
        <div
          class="hollow-card bg-gray-800/50 border border-gray-700 rounded-lg p-4"
        >
          <h3 class="font-semibold text-white mb-3 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-cyan-400"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path
                d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
              />
            </svg>
            <span>Productos ({{ pedido()?.items }})</span>
          </h3>
          <div class="space-y-3">
            @for (producto of pedido()?.productos; track producto.id) {
            <div class="flex justify-between items-start pb-3 border-b border-gray-700 last:border-0 last:pb-0">
              <div class="flex-1">
                <p class="text-white font-medium">{{ producto.nombre }}</p>
                <p class="text-xs text-gray-400 mt-1">Cantidad: {{ producto.cantidad }}</p>
                @if (producto.notas) {
                <p class="text-xs text-gray-500 italic mt-1">
                  "{{ producto.notas }}"
                </p>
                }
              </div>
              <p class="text-yellow-400 font-bold">{{ producto.precio }} Geo</p>
            </div>
            }
          </div>
        </div>

        <!-- Información Adicional -->
        <div
          class="hollow-card bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3"
        >
          <h3 class="font-semibold text-white mb-3">Detalles de Entrega</h3>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-500">Distancia</p>
              <p class="text-white font-medium">{{ pedido()?.distancia }} km</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Tiempo estimado</p>
              <p class="text-white font-medium">
                {{ pedido()?.tiempoEstimado || 'N/A' }} min
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Recompensa</p>
              <p class="text-yellow-400 font-bold text-lg">
                {{ pedido()?.recompensa }} Geo
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Método de pago</p>
              <p class="text-white font-medium capitalize">
                {{ formatMetodoPago(pedido()?.metodoPago) }}
              </p>
            </div>
          </div>

          @if (pedido()?.notas) {
          <div class="mt-4 pt-4 border-t border-gray-700">
            <p class="text-xs text-gray-500 mb-1">Notas del cliente</p>
            <p class="text-white text-sm italic bg-gray-900/50 p-3 rounded">
              "{{ pedido()?.notas }}"
            </p>
          </div>
          }
        </div>

        <!-- Botones de Acción -->
        <div class="grid grid-cols-2 gap-3 pt-4">
          <button
            (click)="rechazarPedido()"
            [disabled]="isProcessing()"
            class="py-3 px-4 bg-red-900/20 border border-red-700 text-red-400 rounded-lg font-semibold
                   hover:bg-red-900/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isProcessing()) {
            <span>Procesando...</span>
            } @else {
            <span>Rechazar</span>
            }
          </button>

          <button
            (click)="aceptarPedido()"
            [disabled]="isProcessing()"
            class="py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold
                   transition-all duration-300 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isProcessing()) {
            <span>Procesando...</span>
            } @else {
            <span>Aceptar Pedido</span>
            }
          </button>
        </div>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .hollow-card {
        transition: all 0.3s ease-out;
      }

      .text-glow {
        text-shadow: 0 0 5px #fff, 0 0 10px #c0c0c0;
      }

      .loader {
        width: 48px;
        height: 48px;
        border: 3px solid #4b5563;
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
export class PedidoDetalleComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Signals
  pedido = signal<Pedido | null>(null);
  isLoading = signal<boolean>(true);
  isProcessing = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPedido(id);
    } else {
      this.isLoading.set(false);
    }
  }

  cargarPedido(id: string): void {
    this.isLoading.set(true);
    this.pedidoService.getPedidoById(id).subscribe((pedido) => {
      this.pedido.set(pedido);
      this.isLoading.set(false);
    });
  }

  volver(): void {
    this.router.navigate(['/repartidor/home']);
  }

  aceptarPedido(): void {
    const pedidoId = this.pedido()?.id;
    if (!pedidoId) return;

    this.isProcessing.set(true);
    this.pedidoService.aceptarPedido(pedidoId).subscribe((success) => {
      this.isProcessing.set(false);
      if (success) {
        // TODO: Navegar a la pantalla de confirmación o lista de pedidos actuales
        alert('Pedido aceptado! 🎉');
        this.volver();
      } else {
        alert('Error al aceptar el pedido');
      }
    });
  }

  rechazarPedido(): void {
    const pedidoId = this.pedido()?.id;
    if (!pedidoId) return;

    const confirmar = confirm('¿Estás seguro de rechazar este pedido?');
    if (!confirmar) return;

    this.isProcessing.set(true);
    this.pedidoService.rechazarPedido(pedidoId).subscribe((success) => {
      this.isProcessing.set(false);
      if (success) {
        alert('Pedido rechazado');
        this.volver();
      } else {
        alert('Error al rechazar el pedido');
      }
    });
  }

  formatMetodoPago(metodo: string | undefined): string {
    if (!metodo) return 'N/A';
    const map: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      'geo-digital': 'Geo Digital',
    };
    return map[metodo] || metodo;
  }
}
