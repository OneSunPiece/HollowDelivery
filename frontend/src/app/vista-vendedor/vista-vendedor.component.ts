// src/app/vista-vendedor/vista-vendedor.component.ts
import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pedido } from '../models/pedido.model';
import { PedidoService } from '../services/pedido.service';
import { AuthService } from '../services/auth.service';

type FiltroEstadoVendedor =
  | 'todos'
  | 'disponible'
  | 'aceptado'
  | 'en-camino'
  | 'entregado'
  | 'rechazado';

interface ProductoInventario {
  id: number;
  nombre: string;
  precio: number;
  disponible: boolean;
}

@Component({
  selector: 'app-vista-vendedor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-screen w-full flex flex-col bg-black text-white">
      <!-- HEADER / BARRA SUPERIOR -->
      <header
        class="sticky top-0 z-10 w-full bg-gray-900/50 border-b border-gray-700 backdrop-blur-md px-4 py-3 flex items-center justify-between"
      >
        <!-- Info Vendedor -->
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30"
          >
            <!-- Icono tienda -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path
                d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"
              />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-gray-400 uppercase tracking-widest">
              Vendedor · HOME
            </span>
            <span class="font-semibold">
              {{ userEmail() || 'vendedor@hollow.com' }}
            </span>
          </div>
        </div>

        <!-- Botones derecha -->
        <div class="flex items-center space-x-2">
          <button
            type="button"
            class="icon-btn"
            title="Refrescar pedidos"
            (click)="refrescar()"
          >
            <!-- refresh -->
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
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.88-3.36L23 10" />
              <path d="M20.49 15a9 9 0 0 1-14.88 3.36L1 14" />
            </svg>
          </button>

          <button
            type="button"
            class="icon-btn icon-danger"
            title="Cerrar sesión"
            (click)="logout()"
          >
            <!-- logout -->
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
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      <!-- CONTENIDO PRINCIPAL (HOME / FEED) -->
      <main class="flex-1 overflow-y-auto p-4 space-y-6">
        <!-- Saludo -->
        @if (user()) {
          <div class="text-gray-400 text-sm">
            Hola,
            <strong class="text-white">
              {{ user()?.name || user()?.email }}
            </strong>
          </div>
        }

        <section class="space-y-3">
          <h1 class="font-cinzel text-2xl sm:text-3xl font-bold text-white text-glow">
            Pedidos del Nido
          </h1>
          <p class="text-sm text-gray-400">
            Feed principal de pedidos. Usa búsqueda, filtros y categorías para
            encontrar rápidamente lo que quieres preparar.
          </p>

          <!-- BÚSQUEDA (Input, filtros, resultados) -->
          <div
            class="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <!-- Input de búsqueda -->
            <div class="relative flex-1">
              <input
                type="text"
                class="w-full bg-gray-900/80 border border-gray-700 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Buscar pedidos por negocio o cliente..."
                (input)="onBusquedaInput($event)"
              />
              <span class="absolute inset-y-0 left-3 flex items-center">
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
                  class="text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
            </div>

            <!-- Atajos / categorías (por estado) -->
            <div
              class="flex flex-wrap gap-2 text-[11px] sm:text-xs justify-start sm:justify-end"
            >
              <button
                type="button"
                class="chip-atajo"
                (click)="cambiarFiltro('disponible')"
              >
                Nuevos
              </button>
              <button
                type="button"
                class="chip-atajo"
                (click)="cambiarFiltro('aceptado')"
              >
                En preparación
              </button>
              <button
                type="button"
                class="chip-atajo"
                (click)="cambiarFiltro('en-camino')"
              >
                Listos / En camino
              </button>
              <button
                type="button"
                class="chip-atajo"
                (click)="cambiarFiltro('todos')"
              >
                Ver todo
              </button>
            </div>
          </div>
        </section>

        <!-- ESTADO DE CARGA / ERROR -->
        @if (isLoading()) {
          <div class="flex justify-center items-center h-64">
            <div class="loader"></div>
          </div>
        }

        @if (!isLoading() && errorMessage()) {
          <div
            class="border border-red-500/40 bg-red-900/30 text-red-200 rounded-xl p-4 text-center max-w-md mx-auto"
          >
            <p class="font-semibold mb-1">
              No se pudieron cargar los pedidos.
            </p>
            <p class="text-sm">{{ errorMessage() }}</p>
          </div>
        }

        <!-- LISTADO DE PEDIDOS (Listado específico + filtros avanzados) -->
        @if (!isLoading() && !errorMessage()) {
          <section class="space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h2 class="section-title">Listado de pedidos</h2>

              <!-- Filtros por estado (avanzados / ordenar sencillo) -->
              <div
                class="flex flex-wrap gap-2 text-[11px] sm:text-xs justify-end"
              >
                <button
                  type="button"
                  class="chip-filter"
                  [class.active]="filtroEstado() === 'todos'"
                  (click)="cambiarFiltro('todos')"
                >
                  Todos
                </button>
                <button
                  type="button"
                  class="chip-filter"
                  [class.active]="filtroEstado() === 'disponible'"
                  (click)="cambiarFiltro('disponible')"
                >
                  Nuevos
                </button>
                <button
                  type="button"
                  class="chip-filter"
                  [class.active]="filtroEstado() === 'aceptado'"
                  (click)="cambiarFiltro('aceptado')"
                >
                  En preparación
                </button>
                <button
                  type="button"
                  class="chip-filter"
                  [class.active]="filtroEstado() === 'en-camino'"
                  (click)="cambiarFiltro('en-camino')"
                >
                  Listos / En camino
                </button>
                <button
                  type="button"
                  class="chip-filter"
                  [class.active]="filtroEstado() === 'entregado'"
                  (click)="cambiarFiltro('entregado')"
                >
                  Entregados
                </button>
                <button
                  type="button"
                  class="chip-filter"
                  [class.active]="filtroEstado() === 'rechazado'"
                  (click)="cambiarFiltro('rechazado')"
                >
                  Cancelados
                </button>
              </div>
            </div>

            @if (pedidosFiltrados().length === 0) {
              <p class="text-sm text-gray-400 text-center mt-10">
                No hay pedidos con ese estado o búsqueda en este momento.
              </p>
            } @else {
              <section class="space-y-3">
                @for (pedido of pedidosFiltrados(); track pedido.id) {
                  <!-- DETALLE RÁPIDO DEL PEDIDO (tarjeta) -->
                  <article
                    class="rounded-xl border border-gray-800 bg-gray-900/70 p-3 flex flex-col gap-2"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="font-medium text-sm">
                          {{ pedido.negocio || 'Pedido sin nombre' }}
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ pedido.cliente?.nombre || 'Cliente anónimo' }} ·
                          {{ formatFecha(pedido.fechaCreacion) }}
                        </p>
                        <p class="text-xs text-gray-400 mt-1">
                          Estado:
                          <span class="font-semibold text-cyan-300">
                            {{ formatEstado(pedido.estado) }}
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        class="text-xs px-3 py-1 rounded-full border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                        (click)="verDetalle(pedido.id)"
                      >
                        Ver detalle
                      </button>
                    </div>

                    <!-- Acciones según estado (flujo de aceptación) -->
                    <div class="flex flex-wrap gap-2 mt-1">
                      @if (pedido.estado === 'disponible') {
                        <button
                          type="button"
                          class="btn-primary"
                          (click)="marcarEnPreparacion(pedido.id)"
                        >
                          Marcar en preparación
                        </button>
                        <button
                          type="button"
                          class="btn-danger"
                          (click)="cancelarPedido(pedido.id)"
                        >
                          Cancelar pedido
                        </button>
                      }

                      @if (pedido.estado === 'aceptado') {
                        <button
                          type="button"
                          class="btn-primary"
                          (click)="marcarListo(pedido.id)"
                        >
                          Marcar listo para envío
                        </button>
                        <button
                          type="button"
                          class="btn-secondary"
                          (click)="regresarANuevo(pedido.id)"
                        >
                          Volver a nuevo
                        </button>
                      }

                      @if (pedido.estado === 'en-camino') {
                        <span class="text-xs text-gray-400">
                          Esperando a que un repartidor lo recoja...
                        </span>
                      }
                    </div>
                  </article>
                }
              </section>
            }
          </section>

          <!-- INVENTARIO + PANTALLA DE CREACIÓN DE PRODUCTOS -->
          <section class="mt-8">
            <h2 class="section-title mb-1">Inventario</h2>
            <p class="text-xs text-gray-400 mb-3">
              Pantalla de creación de productos. Aquí puedes crear, modificar,
              borrar y visualizar los productos que ofreces.
            </p>

            <div
              class="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
            >
              <!-- Formulario de producto -->
              <div
                class="rounded-xl border border-gray-800 bg-gray-900/70 p-3 space-y-3"
              >
                <h3 class="text-sm font-semibold text-white">
                  Crear / Modificar producto
                </h3>

                <div class="space-y-2">
                  <label class="block text-xs text-gray-300">
                    Nombre del producto
                    <input
                      type="text"
                      class="mt-1 w-full bg-gray-950/80 border border-gray-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      placeholder="Ej: Dumplings de Larvas Fritas"
                      (input)="onFormNombreInput($event)"
                      [value]="formNombre()"
                    />
                  </label>

                  <label class="block text-xs text-gray-300">
                    Precio aproximado (Geo)
                    <input
                      type="number"
                      min="0"
                      class="mt-1 w-full bg-gray-950/80 border border-gray-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      placeholder="Ej: 12000"
                      (input)="onFormPrecioInput($event)"
                      [value]="formPrecio() ?? ''"
                    />
                  </label>

                  <label
                    class="inline-flex items-center gap-2 text-xs text-gray-300 mt-1"
                  >
                    <input
                      type="checkbox"
                      class="rounded border-gray-600 bg-gray-900"
                      (change)="onFormDisponibleChange($event)"
                      [checked]="formDisponible()"
                    />
                    Disponible para pedidos
                  </label>
                </div>

                <div class="flex gap-2 mt-3">
                  <button
                    type="button"
                    class="btn-primary flex-1"
                    (click)="guardarProducto()"
                  >
                    {{
                      productoEditando()
                        ? 'Guardar cambios'
                        : 'Crear producto'
                    }}
                  </button>
                  <button
                    type="button"
                    class="btn-secondary"
                    (click)="limpiarFormulario()"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <!-- Lista de productos -->
              <div
                class="rounded-xl border border-gray-800 bg-gray-900/70 p-3 space-y-2"
              >
                <h3 class="text-sm font-semibold text-white">
                  Productos en inventario
                </h3>

                @if (productos().length === 0) {
                  <p class="text-xs text-gray-400">
                    Aún no has creado productos. Usa el formulario de la
                    izquierda para empezar.
                  </p>
                } @else {
                  <ul class="space-y-2">
                    @for (prod of productos(); track prod.id) {
                      <li
                        class="flex items-center justify-between gap-3 text-xs bg-gray-950/70 border border-gray-800 rounded-lg px-3 py-2"
                      >
                        <div>
                          <p class="font-medium text-white">
                            {{ prod.nombre }}
                          </p>
                          <p class="text-gray-400">
                            $ {{ prod.precio | number : '1.0-0' }} ·
                            {{ prod.disponible ? 'Disponible' : 'Oculto' }}
                          </p>
                        </div>
                        <div class="flex gap-2">
                          <button
                            type="button"
                            class="btn-secondary px-2 py-1"
                            (click)="seleccionarProducto(prod)"
                          >
                            Modificar
                          </button>
                          <button
                            type="button"
                            class="btn-danger px-2 py-1"
                            (click)="eliminarProducto(prod.id)"
                          >
                            Borrar
                          </button>
                        </div>
                      </li>
                    }
                  </ul>
                }
              </div>
            </div>
          </section>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .text-glow {
        text-shadow:
          0 0 4px rgba(45, 212, 191, 0.8),
          0 0 16px rgba(45, 212, 191, 0.7);
      }

      .icon-btn {
        @apply p-2 rounded-full border border-gray-700 bg-gray-900/80
        hover:bg-gray-800 hover:border-cyan-400/60 transition-colors;
      }
      .icon-btn.icon-danger {
        @apply hover:border-red-400/70;
      }

      .section-title {
        @apply font-cinzel text-base tracking-wide text-gray-100;
      }

      .chip-atajo {
        @apply px-3 py-1 rounded-full bg-gray-900/80 border border-gray-700
        text-gray-300 hover:border-cyan-400/60 hover:text-cyan-300
        transition-colors;
      }

      .chip-filter {
        @apply text-[11px] sm:text-xs px-3 py-1 rounded-full border border-gray-700
        bg-gray-900/80 text-gray-300 hover:border-cyan-400/60 hover:text-cyan-300
        transition-colors;
      }
      .chip-filter.active {
        @apply border-cyan-400 text-cyan-300;
      }

      .btn-primary {
        @apply text-[11px] sm:text-xs px-3 py-1 rounded-lg border border-cyan-400
        text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors;
      }
      .btn-secondary {
        @apply text-[11px] sm:text-xs px-3 py-1 rounded-lg border border-gray-600
        text-gray-200 bg-gray-800 hover:bg-gray-700 transition-colors;
      }
      .btn-danger {
        @apply text-[11px] sm:text-xs px-3 py-1 rounded-lg border border-red-500/70
        text-red-300 bg-red-900/40 hover:bg-red-900/70 transition-colors;
      }

      .loader {
        width: 48px;
        height: 48px;
        border: 3px solid #4b5563;
        border-bottom-color: #22d3ee;
        border-radius: 9999px;
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
})
export class VistaVendedorComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;

  readonly pedidos = signal<Pedido[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly filtroEstado = signal<FiltroEstadoVendedor>('todos');
  readonly busquedaTexto = signal<string>('');

  // Inventario
  private productoIdCounter = 3;
  readonly productos = signal<ProductoInventario[]>([
    { id: 1, nombre: 'Dumplings de Larvas Fritas', precio: 12000, disponible: true },
    { id: 2, nombre: 'Sopa de Geo Candente', precio: 15000, disponible: true },
    { id: 3, nombre: 'Té de Esporas Luminosas', precio: 9000, disponible: false },
  ]);
  readonly productoEditando = signal<ProductoInventario | null>(null);
  readonly formNombre = signal<string>('');
  readonly formPrecio = signal<number | null>(null);
  readonly formDisponible = signal<boolean>(true);

  readonly pedidosFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    const texto = this.busquedaTexto().toLowerCase().trim();

    let lista = this.pedidos();

    if (filtro !== 'todos') {
      lista = lista.filter((p) => p.estado === filtro);
    }

    if (texto) {
      lista = lista.filter((p) => {
        const negocio = (p.negocio || '').toLowerCase();
        const cliente = (p.cliente?.nombre || '').toLowerCase();
        return negocio.includes(texto) || cliente.includes(texto);
      });
    }

    // Ordenar por fecha descendente
    return [...lista].sort((a, b) => {
      const da = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
      const db = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
      return db - da;
    });
  });

  ngOnInit(): void {
    this.cargarPedidos();
  }

  // ==== HOME / PEDIDOS ====

  userEmail(): string | null {
    const u = this.user();
    return u?.email ?? null;
  }

  cambiarFiltro(f: FiltroEstadoVendedor): void {
    this.filtroEstado.set(f);
  }

  refrescar(): void {
    this.cargarPedidos();
  }

  verDetalle(id: string): void {
    // Reutilizamos la vista de detalle que ya existe para repartidor
    this.router.navigate(['/repartidor/pedido', id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private cargarPedidos(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.pedidoService.getPedidosDisponibles().subscribe({
      next: (data) => {
        this.pedidos.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando pedidos vendedor', err);
        this.errorMessage.set('No se pudieron cargar los pedidos del Nido.');
        this.isLoading.set(false);
      },
    });
  }

  // === Acciones de cambio de estado (flujo de aceptación) ===

  marcarEnPreparacion(id: string): void {
    this.actualizarEstado(id, 'aceptado');
  }

  marcarListo(id: string): void {
    this.actualizarEstado(id, 'en-camino');
  }

  regresarANuevo(id: string): void {
    this.actualizarEstado(id, 'disponible');
  }

  cancelarPedido(id: string): void {
    this.actualizarEstado(id, 'rechazado');
  }

  private actualizarEstado(id: string, estado: Pedido['estado']): void {
    this.pedidoService.actualizarEstadoPedido(id, estado).subscribe({
      next: (ok) => {
        if (!ok) {
          this.errorMessage.set('No se pudo actualizar el estado del pedido.');
          return;
        }
        this.pedidos.update((lista) =>
          lista.map((p) => (p.id === id ? { ...p, estado } : p)),
        );
      },
      error: (err) => {
        console.error('Error actualizando estado', err);
        this.errorMessage.set('Ocurrió un error al actualizar el pedido.');
      },
    });
  }

  // ==== Búsqueda ====

  onBusquedaInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.busquedaTexto.set(value);
  }

  // ==== Inventario: formulario ====

  seleccionarProducto(prod: ProductoInventario): void {
    this.productoEditando.set(prod);
    this.formNombre.set(prod.nombre);
    this.formPrecio.set(prod.precio);
    this.formDisponible.set(prod.disponible);
  }

  eliminarProducto(id: number): void {
    this.productos.update((lista) => lista.filter((p) => p.id !== id));
    const edit = this.productoEditando();
    if (edit && edit.id === id) {
      this.limpiarFormulario();
    }
  }

  guardarProducto(): void {
    const nombre = this.formNombre().trim();
    const precio = this.formPrecio() ?? 0;
    const disponible = this.formDisponible();

    if (!nombre || precio <= 0) {
      // aquí podrías agregar un pequeño mensaje de error si quieres
      return;
    }

    const edit = this.productoEditando();

    if (edit) {
      // Modificar
      this.productos.update((lista) =>
        lista.map((p) =>
          p.id === edit.id ? { ...p, nombre, precio, disponible } : p,
        ),
      );
    } else {
      // Crear
      this.productoIdCounter += 1;
      const nuevo: ProductoInventario = {
        id: this.productoIdCounter,
        nombre,
        precio,
        disponible,
      };
      this.productos.update((lista) => [...lista, nuevo]);
    }

    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.productoEditando.set(null);
    this.formNombre.set('');
    this.formPrecio.set(null);
    this.formDisponible.set(true);
  }

  onFormNombreInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formNombre.set(value);
  }

  onFormPrecioInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const num = Number(value);
    this.formPrecio.set(Number.isFinite(num) ? num : null);
  }

  onFormDisponibleChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.formDisponible.set(checked);
  }

  // ==== Helpers de formato ====

  formatFecha(valor: string | Date | undefined): string {
    if (!valor) return 'Sin fecha';
    const d = new Date(valor);
    return d.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatEstado(estado: Pedido['estado']): string {
    const map: Record<Pedido['estado'], string> = {
      disponible: 'Nuevo',
      aceptado: 'En preparación',
      'en-camino': 'Listo / En camino',
      entregado: 'Entregado',
      rechazado: 'Cancelado',
    };
    return map[estado] ?? estado;
  }
}
