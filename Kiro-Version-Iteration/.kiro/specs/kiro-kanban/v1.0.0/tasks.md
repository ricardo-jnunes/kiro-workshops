# Tasks — v1.0.0

## Task 1: Criar projeto Angular com ng new

- [ ] Executar `ng new kiro-kanban --standalone --routing --style=scss --skip-tests` na raiz do workspace
- [ ] Verificar que o projeto compila com `ng build` sem erros
- [ ] Verificar que `ng serve` inicia sem erros

**Refs**: Design § Estrutura de Arquivos

---

## Task 2: Instalar e configurar Angular Material

- [ ] Executar `ng add @angular/material` no diretório `kiro-kanban/`
- [ ] Configurar o tema Indigo/Pink em `src/styles.scss` com `@use '@angular/material' as mat`
- [ ] Adicionar `provideAnimationsAsync()` em `main.ts`
- [ ] Verificar compilação sem erros após instalação

**Refs**: Design § Configuração do Angular Material, Requirement 4.4

---

## Task 3: Criar estrutura de diretórios da Arquitetura Hexagonal

- [ ] Criar `src/app/domain/models/.gitkeep`
- [ ] Criar `src/app/domain/ports/.gitkeep`
- [ ] Criar `src/app/adapters/services/.gitkeep`
- [ ] Criar `src/app/adapters/components/.gitkeep` (será populado nas tasks seguintes)

**Refs**: Design § Diretórios da Arquitetura Hexagonal, Requirement 4.1

---

## Task 4: Implementar HeaderComponent

- [ ] Criar `src/app/adapters/components/header/header.component.ts`
- [ ] Criar `src/app/adapters/components/header/header.component.html`
- [ ] Criar `src/app/adapters/components/header/header.component.scss`
- [ ] Implementar leitura do título da rota via `Router.events` + `toSignal`
- [ ] Exibir `Kiro-Version-Iteration` + separador + título da rota na mesma linha com `mat-toolbar`

**Refs**: Design § HeaderComponent, Requirements 1.3, 2.4

---

## Task 5: Implementar SidebarComponent

- [ ] Criar `src/app/adapters/components/sidebar/sidebar.component.ts`
- [ ] Criar `src/app/adapters/components/sidebar/sidebar.component.html`
- [ ] Criar `src/app/adapters/components/sidebar/sidebar.component.scss`
- [ ] Implementar `mat-nav-list` com link para `/kanban`
- [ ] Configurar `routerLinkActive="active"` com `[routerLinkActiveOptions]="{ exact: false }"`
- [ ] Estilizar sidebar com largura fixa de 220px e altura 100%

**Refs**: Design § SidebarComponent, Requirements 3.1, 3.3, 3.4

---

## Task 6: Implementar KanbanPlaceholderComponent

- [ ] Criar `src/app/adapters/components/kanban-placeholder/kanban-placeholder.component.ts`
- [ ] Criar `src/app/adapters/components/kanban-placeholder/kanban-placeholder.component.html`
- [ ] Criar `src/app/adapters/components/kanban-placeholder/kanban-placeholder.component.scss`
- [ ] Exibir texto indicativo de que o Kanban será implementado na v2.0.0

**Refs**: Design § KanbanPlaceholderComponent, Requirement 2.1

---

## Task 7: Configurar rotas em app.routes.ts

- [ ] Definir rota `''` com `redirectTo: 'kanban'` e `pathMatch: 'full'`
- [ ] Definir rota `'kanban'` com `KanbanPlaceholderComponent` e `title: 'Kanban'`
- [ ] Definir rota `'**'` com `redirectTo: 'kanban'`
- [ ] Configurar `provideRouter(routes)` em `main.ts`

**Refs**: Design § Configuração de Rotas, Requirements 2.1, 2.2, 2.3, 2.5

---

## Task 8: Implementar AppComponent (Layout Shell)

- [ ] Atualizar `src/app/app.component.ts` com imports de `HeaderComponent`, `SidebarComponent`, `RouterOutlet`
- [ ] Criar template com `.app-shell` > `app-header` + `.app-body` > `app-sidebar` + `main.app-content` > `router-outlet`
- [ ] Implementar layout Flexbox em `app.component.scss` (coluna vertical no shell, linha horizontal no body)
- [ ] Remover qualquer conteúdo gerado pelo `ng new` que não seja necessário

**Refs**: Design § AppComponent, Requirements 1.1, 1.4

---

## Task 9: Verificação final e build

- [ ] Executar `ng build` e confirmar zero erros TypeScript
- [ ] Executar `ng serve` e verificar no navegador:
  - [ ] Layout com Header, Sidebar e área de conteúdo visíveis simultaneamente
  - [ ] URL `/` redireciona para `/kanban`
  - [ ] Header exibe `Kiro-Version-Iteration — Kanban`
  - [ ] Sidebar exibe link `Kanban` com classe `active`
  - [ ] URL inexistente redireciona para `/kanban`
  - [ ] Nenhum erro no console do navegador

**Refs**: Requirements 4.2, 4.3
