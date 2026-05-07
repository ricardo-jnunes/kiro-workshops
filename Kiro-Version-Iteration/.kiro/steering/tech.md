# Tech Stack

## Core Technologies

- **Framework**: Angular 21+ (Standalone Components only — no NgModules)
- **Language**: TypeScript
- **Styling**: SCSS (one global `styles.scss` for variables, themes, resets; no inline styles)
- **State Management**: Angular Signals (no NgRx or other external state libraries)
- **Routing**: Angular Router
- **Forms**: Angular Reactive Forms
- **UI Components**: Angular Material
- **Drag and Drop**: `@angular/cdk/drag-drop`

## Architecture

Hexagonal Architecture with three distinct layers:
- **Domain**: Business logic, models, and port interfaces — must not import from outer layers
- **Ports**: Interfaces that define contracts (e.g., `CardServicePort`)
- **Adapters**: Concrete implementations (e.g., in-memory `CardService`) and UI components

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build

# Run unit tests
ng test --watch=false

# Run linter
ng lint
```

## Key Rules

- Use Standalone Components everywhere — never declare components in NgModules
- Use Angular Signals for all reactive state in components and services
- Services must implement domain port interfaces to allow future swapping
- SCSS only — no CSS inline in templates, no unstructured global styles outside `styles.scss`
- Zero TypeScript compilation errors must be maintained at all times
