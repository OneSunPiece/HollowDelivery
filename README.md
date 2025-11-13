# Hollow Delivery

Aplicación de delivery con temática de Hollow Knight. Sistema de roles para repartidores, vendedores y clientes.

## 🎮 Concepto

Inspirado en el universo de Hollow Knight, Hollow Delivery transforma el proceso de pedir comida en una experiencia atmosférica con estética gótica y referencias al juego.

## 🏗️ Estructura del Proyecto

```
HollowDelivery/
├── frontend/          # Angular 20+ application
│   ├── src/          # Código fuente
│   └── README.md     # Documentación detallada del frontend
└── backend/          # API (pendiente)
```

## 🚀 Inicio Rápido

### Frontend
```bash
cd frontend
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Usuarios de Prueba
- **Repartidor**: `repartidor@hollow.com`
- **Vendedor**: `vendedor@hollow.com`
- **Cliente**: cualquier otro email

## ✨ Estado Actual

### ✅ Implementado
- Sistema de autenticación por roles
- Feed de pedidos disponibles (repartidor)
- Detalle completo de pedidos
- Lista de pedidos activos con filtros
- Flujo de aceptar/rechazar pedidos
- Cambio de estados de entrega

### ⏳ En Desarrollo
- Pantalla de entrega con mapa
- UI para vendedor
- UI para cliente
- Integración con backend

## 🛠️ Stack Tecnológico

### Frontend
- Angular 20.3.1
- TypeScript 5.x
- Tailwind CSS
- RxJS
- SSR habilitado

### Backend (Pendiente)
- Node.js + Express
- MongoDB/PostgreSQL
- WebSockets

## 📚 Documentación

Para más detalles sobre el desarrollo frontend, consulta:
- [Frontend README](./frontend/README.md) - Documentación completa
- [Copilot Instructions](./frontend/.github/copilot-instructions.md) - Guía de desarrollo

## 🎨 Diseño

La aplicación sigue la estética de Hollow Knight:
- Paleta de colores oscura (negro, grises profundos)
- Acentos cyan/teal para elementos interactivos
- Fuente Cinzel para títulos (estilo tallado en piedra)
- Efectos de brillo suave (soul energy)
- Iconografía SVG temática

## 📄 Licencia

Este es un proyecto personal educativo. Hollow Knight y todos sus elementos visuales son propiedad de Team Cherry.

---

**Nota**: Este proyecto está en desarrollo activo. Actualmente usa mock data para demostración.
