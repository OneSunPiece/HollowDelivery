# Hollow Delivery - Frontend

Aplicación Angular 20+ de delivery con temática de Hollow Knight. Sistema de roles para repartidores, vendedores y clientes.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Abrir en navegador
http://localhost:4200
```

## 📋 Usuarios de Prueba

```
Repartidor: repartidor@hollow.com (cualquier contraseña)
Vendedor:   vendedor@hollow.com (cualquier contraseña)
Cliente:    cualquier otro email (cualquier contraseña)
```

## 🏗️ Estructura del Proyecto

```
src/app/
├── pages/              # Páginas principales
│   ├── home/          # Feed de pedidos disponibles
│   ├── mis-pedidos/   # Lista de pedidos activos
│   └── pedido-detalle/ # Detalle de un pedido
├── components/         # Componentes reutilizables
│   └── pedido-card/   # Tarjeta de pedido
├── services/          # Lógica de negocio
│   ├── auth.service.ts
│   └── pedido.service.ts
├── models/            # Interfaces TypeScript
│   └── pedido.model.ts
├── guards/            # Protección de rutas
│   └── auth.guard.ts
└── login/            # Módulo de autenticación
```

## ✨ Características Implementadas

### Repartidor
- ✅ Login con detección de rol por email
- ✅ Feed de pedidos disponibles
- ✅ Detalle de pedido (negocio, cliente, productos)
- ✅ Mis pedidos (filtro por estado: aceptados, en camino, entregados)
- ✅ Aceptar/rechazar pedidos
- ✅ Cambiar estado (iniciar entrega, confirmar entrega)

### Técnicas
- Angular 20+ con componentes standalone
- TypeScript 5.x con modo estricto
- Angular Signals para estado reactivo
- Tailwind CSS para estilos
- RxJS para manejo asíncrono
- OnPush change detection
- SSR habilitado

## 🎨 Stack Tecnológico

- **Angular**: 20.3.1
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.x
- **RxJS**: 7.8.0
- **Fuente**: Cinzel (Google Fonts)
- **Iconos**: SVG inline

## 📝 Comandos Disponibles

```bash
npm start              # Servidor de desarrollo
npm run build          # Build de producción
npm run serve:ssr      # Servidor SSR
npm test               # Tests unitarios
npm run lint           # Verificar código
npm run lint:fix       # Corregir errores de linting
npm run format         # Formatear código con Prettier
```

## 🔐 Sistema de Autenticación

El login determina el rol automáticamente basado en el email:
- **repartidor@hollow.com** → Rol: repartidor
- **vendedor@hollow.com** → Rol: vendedor  
- **otros emails** → Rol: cliente

Cada rol tiene su propia ruta protegida:
- `/repartidor/*` - Para repartidores
- `/vendedor/*` - Para vendedores (UI pendiente)
- `/cliente/*` - Para clientes (UI pendiente)

## 🗺️ Rutas Principales

### Públicas
- `/login` - Página de inicio de sesión

### Repartidor (protegidas)
- `/repartidor/home` - Feed de pedidos disponibles
- `/repartidor/mis-pedidos` - Lista de pedidos activos
- `/repartidor/pedido/:id` - Detalle de pedido

## 🎯 Próximas Funcionalidades

- [ ] Pantalla de entrega con mapa
- [ ] Calificación de entregas
- [ ] Perfil del repartidor
- [ ] UI para vendedor
- [ ] UI para cliente
- [ ] Integración con backend real
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Notificaciones push

## 📚 Documentación Adicional

Para información sobre patrones de código, estilo y arquitectura, consulta:
- `.github/copilot-instructions.md` - Guía completa de desarrollo

---

**Nota**: Este proyecto usa mock data. Para conectar con un backend real, actualiza los servicios en `src/app/services/`.


```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
