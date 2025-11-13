# Hollow Delivery Frontend - AI Coding Guidelines

## Project Overview

Angular 20 SSR application for "Hollow Delivery" - a Hollow Knight-themed food delivery service with a gothic aesthetic.

**Current Implementation Status**:
- ✅ Sistema de autenticación por roles (repartidor/vendedor/cliente)
- ✅ Feed de pedidos disponibles con mock data
- ✅ Detalle de pedido con información completa
- ✅ Mis pedidos con filtros por estado
- ✅ Flujo de aceptar/rechazar pedidos
- ✅ Cambio de estados (aceptado → en camino → entregado)
- ⏳ UI de vendedor y cliente (pendiente)
- ⏳ Integración con backend real (pendiente)

## Architecture & Structure

**Standalone Components Pattern**: No NgModules (excepto placeholders vacíos). Todos los componentes con `standalone: true`.

**Key Files**:
- `src/app/app.ts` - Root con router outlet
- `src/app/app.config.ts` - Config con zoneless change detection
- `src/app/app.routes.ts` - Rutas jerárquicas por rol con guards
- `src/app/services/auth.service.ts` - Autenticación y gestión de roles
- `src/app/services/pedido.service.ts` - Gestión de pedidos (mock data)
- `src/app/guards/auth.guard.ts` - Protección de rutas por rol

**Project Structure**:
```
src/app/
├── pages/              # Componentes de página
│   ├── home/          # Feed de pedidos (repartidor)
│   ├── mis-pedidos/   # Lista de pedidos activos
│   └── pedido-detalle/ # Detalle completo de pedido
├── components/         # Componentes reutilizables
│   └── pedido-card/   # Tarjeta de pedido con accesibilidad
├── models/            # Interfaces TypeScript estrictas
│   └── pedido.model.ts # Pedido, Cliente, NegocioDetalle, etc.
├── services/          # Lógica de negocio
│   ├── auth.service.ts  # Auth + localStorage + signals
│   └── pedido.service.ts # CRUD pedidos con RxJS
├── guards/            # Route guards
│   └── auth.guard.ts  # Verificación de auth y rol
└── login/            # Feature de login con email-based roles
```

## Critical Conventions

### Authentication & Roles

**Role Detection** (email-based):
```typescript
// En AuthService
private determineRole(email: string): 'repartidor' | 'vendedor' | 'cliente' {
  if (email.includes('repartidor')) return 'repartidor';
  if (email.includes('vendedor')) return 'vendedor';
  return 'cliente';
}
```

**Route Protection**:
```typescript
// En app.routes.ts
{
  path: 'repartidor',
  canActivate: [authGuard],
  data: { role: 'repartidor' }, // Guard valida este rol
  children: [...]
}
```

**Test Credentials**:
- `repartidor@hollow.com` → repartidor
- `vendedor@hollow.com` → vendedor
- `cualquier@otro.com` → cliente

### State Management with Signals

**Service Pattern**:
```typescript
// AuthService usa signals para estado reactivo
export class AuthService {
  private userSignal = signal<User | null>(null);
  readonly user = this.userSignal.asReadonly();
  
  get isAuthenticated(): boolean {
    return this.user() !== null;
  }
}
```

**Component Pattern**:
```typescript
// Components usan signals locales
export class HomeComponent {
  pedidos = signal<Pedido[]>([]);
  isLoading = signal(true);
  
  ngOnInit() {
    this.pedidoService.getPedidos().subscribe(data => {
      this.pedidos.set(data);
      this.isLoading.set(false);
    });
  }
}
```

### Data Models Pattern

**Strict TypeScript Interfaces** en `models/`:
```typescript
export interface Pedido {
  id: string;
  negocio: string;
  estado: 'disponible' | 'aceptado' | 'en-camino' | 'entregado' | 'rechazado'; // Union types
  cliente?: Cliente; // Optional nested interfaces
  negocioDetalle?: NegocioDetalle;
  productos?: ProductoPedido[];
  // ... más campos
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono?: string;
  // ... campos opcionales marcados con ?
}
```

### Service Pattern (Mock Data)

**Observable-based Services**:
```typescript
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private mockPedidos: Pedido[] = [/* datos */];
  
  getPedidosDisponibles(): Observable<Pedido[]> {
    return of(this.mockPedidos.filter(p => p.estado === 'disponible'))
      .pipe(delay(800)); // Simula latencia de red
  }
  
  getPedidoById(id: string): Observable<Pedido | null> {
    const pedido = this.mockPedidos.find(p => p.id === id);
    return of(pedido || null).pipe(delay(500));
  }
  
  actualizarEstadoPedido(id: string, estado: Pedido['estado']): Observable<boolean> {
    const pedido = this.mockPedidos.find(p => p.id === id);
    if (pedido) {
      pedido.estado = estado;
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }
}
```

### Template Syntax (Angular 20+)

**IMPORTANTE**: Usar sintaxis de bloques cuando sea apropiado, pero `*ngIf` y `*ngFor` siguen siendo válidos:

```html
<!-- ✅ Sintaxis de bloques moderna -->
@if (condition) {
  <div>Contenido</div>
} @else {
  <div>Alternativo</div>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ✅ También válido - directivas estructurales -->
<div *ngIf="condition">Contenido</div>
<div *ngFor="let item of items">{{ item.name }}</div>
```

### Component Structure

**Naming**: Usar `.ts` para componentes (no `.component.ts`)

**Dependency Injection**: Usar `inject()` pattern:
```typescript
export class MiComponente {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
}
```

**Change Detection**: Usar `OnPush` para optimización:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Iconos**: SVG inline (no librerías externas) para SSR:
```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
     fill="none" stroke="currentColor" stroke-width="2">
  <path d="..."/>
</svg>
```

### Navigation

**RouterLink para navegación declarativa**:
```html
<!-- ✅ Preferido -->
<button routerLink="/repartidor/mis-pedidos">Mis Pedidos</button>

<!-- ✅ También válido para lógica compleja -->
<button (click)="navegarConLogica()">Navegar</button>
```

**Programmatic Navigation**:
```typescript
irADetalle(id: string): void {
  this.router.navigate(['/repartidor/pedido', id]);
}
```

### Styling Stack

**TailwindCSS** + Custom Classes:
```css
/* Clases custom en component styles */
.hollow-card {
  transition: all 0.3s ease-out;
}

.text-glow {
  text-shadow: 0 0 5px #fff, 0 0 10px #c0c0c0;
}

.hollow-btn {
  /* Estilos de botón temático */
}

.hollow-nav-btn {
  /* Botón de navegación del footer */
}
```

**Theme Colors**:
- Backgrounds: `bg-black`, `bg-gray-900`, `bg-gray-800`
- Borders: `border-gray-700`, `border-cyan-400`
- Text: `text-white`, `text-gray-400`, `text-cyan-400`
- Accents: cyan/teal para activos, yellow para recompensas

**Typography**:
- Headers: `font-cinzel` (Cinzel serif)
- Body: Inter sans-serif
- Glow effect: clase `.text-glow`

### Accessibility

**SIEMPRE incluir**:
```html
<div 
  (click)="action()"
  (keydown.enter)="action()"
  (keydown.space)="action()"
  tabindex="0"
  role="button"
>
  Contenido clickeable
</div>
```

**ARIA labels cuando sea necesario**:
```html
<button aria-label="Cerrar sesión" title="Cerrar sesión">
  <svg>...</svg>
</button>
```

## Development Workflow

### Commands
```bash
npm start              # Dev server (http://localhost:4200)
npm run build          # Production build
npm run serve:ssr      # Run SSR server
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix
npm run format         # Prettier
npm test               # Unit tests
```

### Adding Components
```bash
ng generate component pages/nombre-componente
```

### Debugging Navigation
Si la navegación no funciona:
1. Verificar que el componente esté importado en routes
2. Usar `routerLink` en lugar de `(click)` cuando sea posible
3. Agregar `console.log` en métodos de navegación
4. Verificar que el guard no esté bloqueando
5. Hard refresh del browser (Cmd+Shift+R)

**Form Elements**:
```html
<!-- Pattern: Centered, wide inputs with rounded corners -->
<input type="text" 
       class="hollow-input w-full p-3 rounded-md text-center tracking-wider" 
       placeholder="Descriptive placeholder">
```

**Buttons**:
```html
<!-- Primary action: Large, centered, with Cinzel font -->
<button class="hollow-btn font-cinzel text-2xl font-bold py-2 px-6 relative">
  Action Text
</button>

<!-- Secondary action: Smaller, with emoji/icon -->
<button class="hollow-btn font-cinzel text-lg py-2 px-6 relative">
  ✨ Secondary Action
</button>
```

**Loading States**:
- Use spinner with `.loader` class (CSS animation)
- Show loading in same container as content (avoid layout shift)
- Pattern: `<div *@If="isLoading">` followed by `<div *@If="!isLoading">`

**Responsive Spacing**:
- Mobile-first: Use `p-4`, `gap-6`, `mb-4` as base
- Scale up on larger screens: `md:text-6xl`, `max-w-sm` containers

### Content Writing Guidelines

**Terminology** (Hollow Knight universe):
- "Nido" (Nest) - for restaurant/kitchen
- "Hallownest" - the kingdom/delivery area
- "Geo" - currency
- "Vessel" - customer/user
- "Shell" - profile/account
- Avoid modern tech terms; use atmospheric alternatives

**Tone Examples**:
- ✅ "No se pudo contactar con la cocina del Nido" (Could not contact the Nest's kitchen)
- ✅ "Creado en los páramos de Hallownest" (Created in the wastelands of Hallownest)
- ❌ "Error 404" or "Server unavailable" (too technical)

**Menu Item Descriptions**:
- Reference fictional ingredients: void essence, lumafly eggs, Crystal Peak minerals
- Atmospheric adjectives: espeluznante (spooky), sabrosa (tasty), aromática (aromatic)
- Bold item names with `<strong>` tags for emphasis

### Animation & Interaction Patterns

**Hover States**: Subtle color transitions (`transition-colors`), slight brightness increase
**Focus States**: Maintain accessibility with visible focus indicators
**Modal Entry**: Consider fade-in animations (future enhancement)
**Button Presses**: Use `relative` positioning for future pseudo-element effects

### Accessibility Within Theme
- Maintain contrast ratios despite dark theme (text-gray-300 on dark backgrounds)
- Use semantic HTML (`role="button"`, `aria-label`)
- Support keyboard navigation (`(keyup.enter)`, `(keyup.escape)`, `tabindex`)
- Ensure all interactive elements have accessible labels

## Environment Setup

Before running, developers must:
1. Add `geminiApiKey` to `src/environments/environment.ts`
2. Keep environment files out of version control (API keys are sensitive)

## Current Limitations

- Only login and home pages are implemented
- Authentication flow is not connected yet (login doesn't navigate to home)
- Mock data only - no real backend integration
- Module files (`core.module.ts`, `features.module.ts`, `shared.module.ts`) are placeholders
- Navigation between pages needs guard implementation for authentication
