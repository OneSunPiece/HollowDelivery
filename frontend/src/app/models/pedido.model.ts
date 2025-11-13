// src/app/models/pedido.model.ts

export interface Pedido {
  id: string;
  negocio: string; // 
  distancia: number; // en kilómetros
  recompensa: number; // en "Geo"
  items: number; // Cantidad de productos
  direccionRecogida: string;
  direccionEntrega: string;
  estado: 'disponible' | 'aceptado' | 'en-camino' | 'entregado' | 'rechazado';
  
  // Información adicional para el detalle
  cliente?: Cliente;
  negocioDetalle?: NegocioDetalle;
  productos?: ProductoPedido[];
  notas?: string;
  tiempoEstimado?: number; // en minutos
  fechaCreacion?: Date | string;
  metodoPago?: 'efectivo' | 'tarjeta' | 'geo-digital';
  coordenadasRecogida?: Coordenadas;
  coordenadasEntrega?: Coordenadas;
}

export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  avatar?: string;
  direccion?: string;
}

export interface NegocioDetalle {
  id: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  categoria?: string;
  imagen?: string;
  horario?: string;
}

export interface ProductoPedido {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  notas?: string;
  imagen?: string;
}

export interface Coordenadas {
  lat: number;
  lng: number;
}
