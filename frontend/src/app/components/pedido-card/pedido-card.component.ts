// src/app/components/pedido-card/pedido-card.component.ts
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-pedido-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="pedido"
      (click)="onSelectPedido()"
      (keydown.enter)="onSelectPedido()"
      (keydown.space)="onSelectPedido()"
      tabindex="0"
      role="button"
      class="hollow-card bg-gray-800/50 border border-gray-700 rounded-lg p-4
                backdrop-blur-sm shadow-lg transition-all duration-300
                hover:border-cyan-400 hover:shadow-cyan-400/20 cursor-pointer"
    >
      <!-- Encabezado de la Tarjeta -->
      <h3 class="font-cinzel text-xl font-bold text-white text-glow mb-2">
        {{ pedido.negocio }}
      </h3>
      <p class="text-sm text-gray-400 mb-4">{{ pedido.direccionRecogida }}</p>

      <!-- Detalles del Pedido -->
      <div class="flex justify-between items-center text-gray-300 space-x-4">
        <div class="flex items-center space-x-1" title="Recompensa (Geo)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400">
            <circle cx="8" cy="8" r="6"/>
            <path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
            <path d="M7 6h1v4"/>
            <path d="m16.71 13.88.7.71-2.82 2.82"/>
          </svg>
          <span class="font-bold text-lg text-white">{{ pedido.recompensa }}</span>
          <span class="text-sm">Geo</span>
        </div>

        <div class="flex items-center space-x-1" title="Distancia">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{{ pedido.distancia }} km</span>
        </div>

        <div class="flex items-center space-x-1" title="Items">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m7.5 4.27 9 5.15"/>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5"/>
            <path d="M12 22V12"/>
          </svg>
          <span>{{ pedido.items }}</span>
        </div>
      </div>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoCardComponent {
  @Input({ required: true }) pedido!: Pedido;

  private readonly router = inject(Router);

  // Navegar al detalle del pedido
  onSelectPedido(): void {
    this.router.navigate(['/repartidor/pedido', this.pedido.id]);
  }
}
