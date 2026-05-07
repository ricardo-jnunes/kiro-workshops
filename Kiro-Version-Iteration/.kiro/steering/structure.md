# Project Structure

The project follows Hexagonal Architecture. Source code lives under `src/app/` organized by layer.

```
src/
├── app/
│   ├── domain/                  # Inner layer — no imports from outer layers
│   │   ├── models/              # Interfaces and types (Card, Priority, Status)
│   │   └── ports/               # Service port interfaces (e.g., CardServicePort)
│   │
│   ├── adapters/                # Outer layer — implements ports, contains UI
│   │   ├── services/            # Concrete service implementations (e.g., CardService)
│   │   └── components/          # Standalone Angular components
│   │       ├── kanban-board/    # Main board component
│   │       ├── kanban-column/   # Column component
│   │       ├── kanban-card/     # Card component
│   │       ├── card-form/       # Reactive form for create/edit
│   │       ├── header/          # App header
│   │       └── sidebar/         # Navigation sidebar
│   │
│   ├── app.routes.ts            # Route definitions (Angular Router)
│   └── app.component.ts         # Root standalone component (layout shell)
│
├── styles.scss                  # Global styles, variables, themes, resets
└── main.ts                      # Bootstrap entry point
```

## Naming Conventions

- **Files**: kebab-case (e.g., `kanban-board.component.ts`)
- **Classes/Interfaces**: PascalCase (e.g., `CardService`, `CardServicePort`)
- **Signals**: camelCase, no special suffix (e.g., `cards`, `columns`)
- **Ports/Interfaces**: suffix with `Port` (e.g., `CardServicePort`)

## Component Rules

- Every component is a Standalone Component with its own `.scss` file
- Components import only what they need (Angular Material modules, CDK, etc.)
- No shared NgModule — use direct imports in each component's `imports` array

## Layer Dependency Rule

```
UI Components → Ports (interfaces) ← Services (adapters)
                     ↑
                  Domain Models
```

Domain models and ports are the only shared contracts. Adapters depend on ports, never the reverse.
