# Hollow Delivery Frontend - AI Coding Guidelines

## Project Overview

Angular 20 SSR application for "Hollow Delivery" - a Hollow Knight-themed food delivery service with a gothic aesthetic. Currently implements a login page with Gemini AI-powered menu generation.

## Architecture & Structure

**Standalone Components Pattern**: This project uses Angular's standalone components (no NgModules except empty placeholders in `core/`, `features/`, `shared/`). All components declare `standalone: true` and explicitly import their dependencies.

**Key Files**:
- `src/app/app.ts` - Root component with direct component imports (not routing)
- `src/app/app.config.ts` - Application config with zoneless change detection (`provideZonelessChangeDetection()`)
- `src/app/app.routes.ts` - Currently empty route configuration
- `src/environments/environment.ts` - Environment variables (API keys should be kept private)

**SSR Configuration**: Project has full server-side rendering setup via `@angular/ssr` with Express server (`src/server.ts`).

## Critical Conventions

### Template Syntax (Angular 20+)
Use **block template syntax** (not structural directives):
```html
<!-- ✅ Correct - Use @if, @for, @switch -->
<div *@If="condition">...</div>
<div *@For="item of items; track item.id">...</div>

<!-- ❌ Avoid - Old syntax -->
<div *ngIf="condition">...</div>
<div *ngFor="let item of items">...</div>
```

### Styling Stack
- **TailwindCSS** for utility classes (configured in `tailwind.config.js`)
- **Custom font**: `font-cinzel` (Cinzel from Google Fonts) for headings
- **Theme**: Gothic/dark aesthetic with custom classes: `hollow-input`, `hollow-btn`, `text-glow`, `modal-overlay`
- Global styles in `src/styles.css` include video background setup 

### Component Structure
- **Naming**: Components use `.ts`/`.html`/`.css` (not `.component.ts`)
- **Selectors**: Use `app-` prefix with kebab-case (enforced by ESLint)
- **Dependency injection**: Use `inject()` function pattern (see `login.ts`: `private http = inject(HttpClient)`)

### API Integration Pattern
**Gemini AI Integration** (see `src/app/login/login.ts`):
- API key from `environment.geminiApiKey`
- Direct HTTP calls to Google Generative AI endpoint
- Response parsing: `result.candidates?.[0]?.content?.parts?.[0]?.text`
- HTML sanitization via `[innerHTML]` binding with manual string manipulation

## Development Workflow

### Commands
```bash
npm start              # Dev server (http://localhost:4200)
npm run build          # Production build
npm run serve:ssr      # Run SSR server after build
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix linting issues
npm run format         # Prettier formatting (100 char width, single quotes)
npm test               # Karma unit tests
```

### Code Quality
- **TypeScript**: Strict mode enabled (`strict: true`, `noImplicitReturns`, `noFallthroughCasesInSwitch`)
- **Prettier**: 100 char width, single quotes, Angular HTML parser
- **ESLint**: Angular-specific rules with TypeScript stylistic configs

### Adding New Components
```bash
ng generate component component-name
```
Will scaffold with standalone component by default.

## Integration Points

**External APIs**:
- Google Gemini AI (`generativelanguage.googleapis.com`) - Menu content generation
- Future backend: `environment.apiUrl` points to `http://localhost:3000`

**HTTP Client**: Configured globally via `provideHttpClient()` in `app.config.ts`

## Theme & Branding

### Design Philosophy
Hollow Delivery draws inspiration from the atmospheric, hand-drawn world of Hollow Knight. Every UI element should evoke the game's gothic beauty, melancholic tone, and insect-kingdom aesthetic.

### Visual Language

**Color Palette**:
- Primary backgrounds: Deep blacks (`#000`) and dark grays (`#1a1a1a`, `#2d2d2d`)
- Accents: Pale blues (soul energy), soft whites (mask fragments), muted purples (void)
- Borders: Gray tones with subtle glows (`border-gray-600` with `text-glow` class)
- Error states: Muted reds (`text-red-400`) - avoid bright colors

**Typography**:
- Headers: `font-cinzel` (Cinzel serif) - evokes carved stone tablets
- Body text: Inter sans-serif for readability
- Tracking: Use `tracking-wider` for inputs and important text to create gravitas

**Custom CSS Classes** (defined in component CSS files):
- `.hollow-input` - Translucent input fields with subtle borders
- `.hollow-btn` - Gothic button style with hover effects
- `.text-glow` - Soft luminescent text effect (like soul energy)
- `.modal-overlay` - Semi-transparent dark backdrop with blur

### UI/UX Patterns

**Modal Dialogs**:
```html
<!-- Pattern: Overlay + centered card with close button -->
<div *@If="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="modal-overlay absolute inset-0 bg-black bg-opacity-75" (click)="close()"></div>
  <div class="modal-content relative bg-gray-900 bg-opacity-80 border border-gray-600 rounded-lg shadow-2xl">
    <!-- Content -->
    <button class="absolute top-3 right-4 text-gray-400 hover:text-white">
      <!-- X icon -->
    </button>
  </div>
</div>
```

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

- Routes configuration exists but is empty (`app.routes.ts`)
- Module files (`core.module.ts`, `features.module.ts`, `shared.module.ts`) are placeholders
- Only login page is implemented; no actual authentication flow yet
