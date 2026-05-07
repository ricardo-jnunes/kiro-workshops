# Kiro Kanban Workshop

Workshop prático de desenvolvimento frontend com **Kiro** (AI-powered IDE), demonstrando como construir um aplicativo Kanban em Angular seguindo **Spec-Driven Development (SDD)** com entregas iterativas e incrementais (Sprints).

---

## Sobre o Projeto

O **Kiro-Version-Iteration** é um SPA Angular para uso interno, que oferece um quadro Kanban para gerenciamento visual de tarefas. O projeto é construído de forma iterativa em 4 versões, cada uma com sua própria especificação completa (requisitos → design → tarefas).

O objetivo do workshop é demonstrar na prática como o Kiro auxilia em todas as etapas do desenvolvimento: desde a criação de steering files e especificações até a implementação do código.

---

## Stack Tecnológica

| Tecnologia | Versão |
|---|---|
| Angular | 21+ |
| TypeScript | 5+ |
| Angular Material | 21+ |
| Angular CDK | 21+ |
| SCSS | — |

**Padrões utilizados:**
- Standalone Components (sem NgModules)
- Angular Signals para estado reativo
- Angular Router
- Reactive Forms
- Arquitetura Hexagonal

---

## Estrutura do Repositório

```
kiro-workshops/
├── .kiro/
│   ├── steering/                  # Regras sempre ativas para o assistente
│   │   ├── product.md             # Visão geral do produto
│   │   ├── tech.md                # Stack, arquitetura e comandos
│   │   ├── structure.md           # Organização de pastas e convenções
│   │   └── workflow.md            # Regras de processo SDD
│   │
│   └── specs/
│       └── kiro-kanban/
│           ├── v1.0.0/            # Iteração 1 — Layout base
│           │   ├── requirements.md
│           │   ├── design.md
│           │   ├── tasks.md
│           │   └── .config.kiro
│           ├── v2.0.0/            # Iteração 2 — Quadro Kanban
│           ├── v3.0.0/            # Iteração 3 — Cards e drag and drop
│           └── v4.0.0/            # Iteração 4 — CRUD completo
│
├── kiro-kanban/                   # Código da aplicação Angular
│   └── src/
│       └── app/
│           ├── domain/            # Modelos e interfaces de porta
│           └── adapters/          # Serviços e componentes
│
├── prompt-setup.md                # Prompt para recriar o setup do zero
└── README.md
```

---

## Iterações do Projeto

### v1.0.0 — Estrutura Base
- Projeto Angular com Arquitetura Hexagonal
- Layout principal: Header + Sidebar + área de conteúdo
- Angular Router com rota `/kanban` e redirecionamentos
- Tema Angular Material configurado

### v2.0.0 — Quadro Kanban
- Componente `KanbanBoard` com três colunas fixas
- Colunas: **Backlog**, **Em Andamento**, **Concluído**
- Contagem de cards por coluna via Angular Signals
- Estado vazio com mensagem por coluna

### v3.0.0 — Cards e Drag and Drop
- Modelo de dados `Card` na camada de domínio
- `CardServicePort` e implementação mock em memória
- Renderização de cards com indicador visual de prioridade
- Arrastar e soltar entre colunas com `@angular/cdk/drag-drop`

### v4.0.0 — CRUD Completo
- Formulário reativo (`Card_Form`) para criar e editar cards
- Validação com Angular Reactive Forms
- Diálogo de confirmação para exclusão
- Ciclo completo: criar → editar → excluir → atualizar UI

---

## Como Usar Este Workshop

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [Angular CLI](https://angular.io/cli) 21+
- [Kiro IDE](https://kiro.dev)

### Iniciando do Zero

Se quiser recriar todo o setup a partir do zero em um novo workspace, use o arquivo `prompt-setup.md` como guia. Ele contém todos os prompts necessários para:

1. Criar os arquivos de steering
2. Gerar os requisitos versionados das 4 iterações
3. Avançar para design, tarefas e implementação

### Executando a Aplicação

```bash
# Entrar no diretório da aplicação
cd kiro-kanban

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
ng serve

# Acessar em http://localhost:4200
```

---

## Fluxo de Trabalho SDD

Cada iteração segue obrigatoriamente as 3 fases do **Spec-Driven Development**:

```
Requisitos  →  Design  →  Tarefas  →  Implementação
    ↑                                       |
    └───────────── validar antes de avançar ┘
```

1. **Requisitos** — User stories com critérios de aceitação no padrão EARS/INCOSE
2. **Design** — Arquitetura, componentes, interfaces e decisões técnicas
3. **Tarefas** — Lista de tarefas de implementação derivadas do design
4. **Implementação** — Código incremental, compilando ao final de cada entrega

---

## Arquitetura Hexagonal

```
Componentes de UI  →  Portas (interfaces)  ←  Serviços (adaptadores)
                             ↑
                        Modelos de Domínio
```

- **Domínio** (`src/app/domain/`): modelos e interfaces de porta — sem dependências externas
- **Adaptadores** (`src/app/adapters/`): serviços concretos e componentes Angular
- Serviços são injetados via token de porta, nunca pela classe concreta

---

## Steering Files

Os arquivos em `.kiro/steering/` são incluídos automaticamente em toda sessão do Kiro, garantindo que o assistente sempre siga as convenções do projeto:

| Arquivo | Conteúdo |
|---|---|
| `product.md` | O que é o produto, funcionalidades e restrições |
| `tech.md` | Stack, arquitetura e comandos comuns |
| `structure.md` | Organização de pastas e convenções de nomenclatura |
| `workflow.md` | Regras de processo SDD e ordem das iterações |

---

## Licença

Este projeto é um workshop educacional de uso livre.
