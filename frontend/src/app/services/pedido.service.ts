// src/app/services/pedido.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private mockPedidos: Pedido[] = [
    {
      id: 'p-001',
      negocio: 'Bazar de Salubra',
      distancia: 1.2,
      recompensa: 150,
      items: 2,
      direccionRecogida: 'Cruces Olvidados, Cabaña de Salubra',
      direccionEntrega: 'Bocasucia, Pozo',
      estado: 'disponible',
      cliente: {
        id: 'c-001',
        nombre: 'El Caballero',
        telefono: '+505 8888-8888',
        direccion: 'Bocasucia, Pozo',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=knight',
      },
      negocioDetalle: {
        id: 'n-001',
        nombre: 'Bazar de Salubra',
        direccion: 'Cruces Olvidados, Cabaña de Salubra',
        telefono: '+505 7777-7777',
        categoria: 'Amuletos y Reliquias',
        horario: '8:00 AM - 10:00 PM',
      },
      productos: [
        {
          id: 'prod-001',
          nombre: 'Amuleto del Recolector',
          cantidad: 1,
          precio: 80,
          notas: 'Envolver con cuidado',
        },
        {
          id: 'prod-002',
          nombre: 'Lágrima de Alcista',
          cantidad: 1,
          precio: 70,
        },
      ],
      notas: 'Dejar en la puerta, no tocar el timbre',
      tiempoEstimado: 25,
      fechaCreacion: new Date('2025-11-13T15:30:00'),
      metodoPago: 'geo-digital',
      coordenadasRecogida: { lat: 12.1234, lng: -86.2345 },
      coordenadasEntrega: { lat: 12.1456, lng: -86.2567 },
    },
    {
      id: 'p-002',
      negocio: 'Taller del Aguijón',
      distancia: 0.8,
      recompensa: 250,
      items: 1,
      direccionRecogida: 'Ciudad de Lágrimas, Taller del Herrero',
      direccionEntrega: 'Torre de Lujo, Fuente',
      estado: 'disponible',
      cliente: {
        id: 'c-002',
        nombre: 'Hornet',
        telefono: '+505 9999-9999',
        direccion: 'Torre de Lujo, Fuente',
      },
      negocioDetalle: {
        id: 'n-002',
        nombre: 'Taller del Aguijón',
        direccion: 'Ciudad de Lágrimas, Taller del Herrero',
        telefono: '+505 6666-6666',
        categoria: 'Armería',
        horario: '7:00 AM - 11:00 PM',
      },
      productos: [
        {
          id: 'prod-003',
          nombre: 'Aguijón Mejorado',
          cantidad: 1,
          precio: 250,
          notas: 'Afilar antes de entregar',
        },
      ],
      notas: 'Urgente - Cliente esperando',
      tiempoEstimado: 15,
      fechaCreacion: new Date('2025-11-13T16:00:00'),
      metodoPago: 'efectivo',
      coordenadasRecogida: { lat: 12.1567, lng: -86.2789 },
      coordenadasEntrega: { lat: 12.1678, lng: -86.2890 },
    },
    {
      id: 'p-003',
      negocio: 'Comedor del Huevo Vívido',
      distancia: 2.5,
      recompensa: 400,
      items: 5,
      direccionRecogida: 'Nido Profundo, Aldea Distante',
      direccionEntrega: 'Páramos Fúngicos, Aldea de las Mantis',
      estado: 'disponible',
      cliente: {
        id: 'c-003',
        nombre: 'Quirrel',
        telefono: '+505 7777-7778',
        direccion: 'Páramos Fúngicos, Aldea de las Mantis',
      },
      negocioDetalle: {
        id: 'n-003',
        nombre: 'Comedor del Huevo Vívido',
        direccion: 'Nido Profundo, Aldea Distante',
        telefono: '+505 5555-5555',
        categoria: 'Restaurante',
        horario: '6:00 AM - 12:00 AM',
      },
      productos: [
        {
          id: 'prod-004',
          nombre: 'Sopa de Lumafly',
          cantidad: 2,
          precio: 120,
        },
        {
          id: 'prod-005',
          nombre: 'Esencia de Void',
          cantidad: 1,
          precio: 80,
        },
        {
          id: 'prod-006',
          nombre: 'Pan de Cristal',
          cantidad: 2,
          precio: 100,
        },
      ],
      notas: 'Mantener caliente durante el trayecto',
      tiempoEstimado: 40,
      fechaCreacion: new Date('2025-11-13T14:45:00'),
      metodoPago: 'tarjeta',
      coordenadasRecogida: { lat: 12.1890, lng: -86.3012 },
      coordenadasEntrega: { lat: 12.2123, lng: -86.3234 },
    },
  ];

  // Simula una llamada API para obtener pedidos generales
  getPedidosDisponibles(): Observable<Pedido[]> {
    return of(this.mockPedidos).pipe(
      delay(1000) // Simula la latencia de la red
    );
  }

  // Simula una llamada API para obtener un pedido específico por ID
  getPedidoById(id: string): Observable<Pedido | null> {
    const pedido = this.mockPedidos.find((p) => p.id === id);
    return of(pedido || null).pipe(delay(800));
  }

  // Simula actualizar el estado de un pedido
  actualizarEstadoPedido(
    id: string,
    nuevoEstado: Pedido['estado']
  ): Observable<boolean> {
    const pedido = this.mockPedidos.find((p) => p.id === id);
    if (pedido) {
      pedido.estado = nuevoEstado;
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  // Simula aceptar un pedido
  aceptarPedido(id: string): Observable<boolean> {
    return this.actualizarEstadoPedido(id, 'aceptado');
  }

  // Simula rechazar un pedido
  rechazarPedido(id: string): Observable<boolean> {
    return this.actualizarEstadoPedido(id, 'rechazado');
  }

  // Obtiene los pedidos del repartidor (aceptados, en-camino, entregados)
  getMisPedidos(): Observable<Pedido[]> {
    // Filtra pedidos que no estén disponibles ni rechazados
    const misPedidos = this.mockPedidos.filter(
      (p) => p.estado !== 'disponible' && p.estado !== 'rechazado'
    );
    return of(misPedidos).pipe(delay(800));
  }
}
