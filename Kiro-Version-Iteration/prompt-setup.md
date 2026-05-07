# Prompt de Setup — Kiro Kanban Workshop

Use este arquivo para recriar do zero toda a configuração do projeto Kiro Kanban:
arquivos de steering, specs versionadas e requisitos detalhados para todas as iterações.

---

## PASSO 1 — Criar Arquivos de Steering

Crie os seguintes arquivos em `.kiro/steering/`:

### `.kiro/steering/product.md`

```markdown
# Visão Geral do Produto

**Kiro-Version-Iteration** é um SPA Angular para uso interno da empresa, voltado ao gerenciamento visual de tarefas por meio de um quadro Kanban.

## Funcionalidades Principais

- Quadro Kanban com três colunas fixas: **Backlog**, **Em Andamento**, **Concluído**
- Cards com título, descrição, prioridade (`baixa`, `média`, `alta`) e status
- Arrastar e soltar cards entre colunas
- Criar, editar e excluir cards por meio de um formulário reativo (modal ou painel lateral)
- Atualizações em tempo real via Angular Signals — sem recarregamento de página

## Público-Alvo

Membros internos da equipe que precisam acompanhar e gerenciar tarefas de forma visual.

## Restrições Principais

- Todos os dados são armazenados em memória (serviço mock) — sem integração com backend nesta iteração
- O `Card_Service` deve implementar uma interface de porta do domínio para permitir substituição futura por uma API real sem alterar os componentes consumidores
```

---

### `.kiro/steering/tech.md`

```markdown
# Stack Tecnológica

## Tecnologias Principais

- **Framework**: Angular 21+ (somente Standalone Components — sem NgModules)
- **Linguagem**: TypeScript
- **Estilização**: SCSS (um único arquivo global `styles.scss` para variáveis, temas e resets; sem estilos inline)
- **Gerenciamento de Estado**: Angular Signals (sem NgRx ou outras bibliotecas externas de estado)
- **Roteamento**: Angular Router
- **Formulários**: Angular Reactive Forms
- **Componentes de UI**: Angular Material
- **Arrastar e Soltar**: `@angular/cdk/drag-drop`

## Arquitetura

Arquitetura Hexagonal com três camadas distintas:
- **Domínio**: Lógica de negócio, modelos e interfaces de porta — não deve importar de camadas externas
- **Portas**: Interfaces que definem contratos (ex.: `CardServicePort`)
- **Adaptadores**: Implementações concretas (ex.: `CardService` em memória) e componentes de UI

## Comandos Comuns

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
ng serve

# Build para produção
ng build

# Executar testes unitários
ng test --watch=false

# Executar linter
ng lint
```

## Regras Principais

- Usar Standalone Components em todo o projeto — nunca declarar componentes em NgModules
- Usar Angular Signals para todo estado reativo em componentes e serviços
- Serviços devem implementar interfaces de porta do domínio para permitir substituição futura
- Somente SCSS — sem CSS inline nos templates, sem estilos globais fora do `styles.scss`
- Zero erros de compilação TypeScript devem ser mantidos em todos os momentos
```

---

### `.kiro/steering/structure.md`

```markdown
# Estrutura do Projeto

O projeto segue Arquitetura Hexagonal. O código-fonte fica em `src/app/` organizado por camada.

```
src/
├── app/
│   ├── domain/                  # Camada interna — sem imports de camadas externas
│   │   ├── models/              # Interfaces e tipos (Card, Priority, Status)
│   │   └── ports/               # Interfaces de porta dos serviços (ex.: CardServicePort)
│   │
│   ├── adapters/                # Camada externa — implementa portas, contém UI
│   │   ├── services/            # Implementações concretas dos serviços (ex.: CardService)
│   │   └── components/          # Standalone Angular Components
│   │       ├── kanban-board/    # Componente principal do quadro
│   │       ├── kanban-column/   # Componente de coluna
│   │       ├── kanban-card/     # Componente de card
│   │       ├── card-form/       # Formulário reativo para criar/editar
│   │       ├── header/          # Cabeçalho da aplicação
│   │       └── sidebar/         # Barra de navegação lateral
│   │
│   ├── app.routes.ts            # Definição de rotas (Angular Router)
│   └── app.component.ts         # Componente raiz standalone (layout shell)
│
├── styles.scss                  # Estilos globais, variáveis, temas e resets
└── main.ts                      # Ponto de entrada da aplicação
```

## Convenções de Nomenclatura

- **Arquivos**: kebab-case (ex.: `kanban-board.component.ts`)
- **Classes/Interfaces**: PascalCase (ex.: `CardService`, `CardServicePort`)
- **Signals**: camelCase, sem sufixo especial (ex.: `cards`, `columns`)
- **Portas/Interfaces**: sufixo `Port` (ex.: `CardServicePort`)

## Regras de Componentes

- Todo componente é um Standalone Component com seu próprio arquivo `.scss`
- Componentes importam apenas o que precisam (módulos do Angular Material, CDK, etc.)
- Sem NgModule compartilhado — usar imports diretos no array `imports` de cada componente

## Regra de Dependência entre Camadas

```
Componentes de UI → Portas (interfaces) ← Serviços (adaptadores)
                          ↑
                     Modelos de Domínio
```

Modelos de domínio e portas são os únicos contratos compartilhados. Adaptadores dependem de portas, nunca o contrário.
```

---

### `.kiro/steering/workflow.md`

```markdown
# Fluxo de Trabalho

Este projeto segue **Spec-Driven Development (SDD)** com entregas iterativas incrementais. As regras abaixo são obrigatórias e devem ser seguidas em toda sessão de trabalho.

## Regras de Processo

1. As entregas são feitas de forma iterativa (Sprints/Versões semânticas)
2. Definir primeiro as interfaces, modelos e estrutura da feature antes de implementar
3. Implementar em pequenas entregas funcionais
4. Validar cada etapa antes de avançar para a próxima
5. Nunca gerar toda a aplicação de uma vez
6. Priorizar funcionamento incremental — cada entrega deve rodar
7. Sempre manter o projeto compilando e executando ao final de cada iteração
8. Cada entrega deve ser pequena, funcional e testável de forma independente

## Spec-Driven Development (SDD)

Cada iteração segue obrigatoriamente as **3 fases do SDD**:

1. **Requisitos** — User stories e critérios de aceitação (padrão EARS/INCOSE)
2. **Design** — Arquitetura, componentes, interfaces e decisões técnicas
3. **Tarefas** — Lista de tarefas de implementação derivadas do design

Não avançar para a fase seguinte sem completar e validar a fase atual.

## Estrutura de Diretórios de Especificação

Cada iteração tem seu próprio diretório versionado:

```
.kiro/specs/{nome-do-projeto}/{versão-semântica}/
  requirements.md
  design.md
  tasks.md
  .config.kiro
```

**Exemplos:**
- `.kiro/specs/kiro-kanban/v1.0.0/`
- `.kiro/specs/kiro-kanban/v2.0.0/`
- `.kiro/specs/kiro-kanban/v3.0.0/`

O código da aplicação fica em diretório separado das especificações (ex.: `kiro-kanban/` na raiz do workspace).

## Ordem das Iterações — Kiro Kanban

| Versão | Escopo |
|--------|--------|
| v1.0.0 | Estrutura base Angular, layout, rotas, Sidebar, Header |
| v2.0.0 | Quadro Kanban, colunas fixas (Backlog, Em Andamento, Concluído) |
| v3.0.0 | Modelo de Card, serviço mock, renderização, arrastar e soltar |
| v4.0.0 | Criação, edição e exclusão de cards (CRUD completo) |
```

---

## PASSO 2 — Criar Requisitos Versionados

Crie os requisitos para todas as 4 iterações do projeto Kiro Kanban seguindo Spec-Driven Development.

**Instrução para o assistente:**

Crie um aplicativo frontend para um sistema interno de Kanban seguindo Spec-Driven Development (SDD) com entregas iterativas incrementais.

### Objetivos do Projeto

- Quadro de tarefas para registrar planos de trabalho e acompanhar o progresso
- Frontend SPA em Angular com Quadro Kanban, visualização de cards e controle de fluxo de trabalho

### Stack Obrigatória

- Angular 21+ com Standalone Components
- Angular Signals para estado reativo
- Angular Router
- Reactive Forms
- TypeScript + SCSS
- Angular Material
- `@angular/cdk/drag-drop` para arrastar e soltar

### Arquitetura

- Nome da aplicação: **Kiro-Version-Iteration**
- Arquitetura Hexagonal (domínio / portas / adaptadores)

### Forma de Trabalho

- Entregas iterativas por versão semântica
- Cada iteração segue as 3 fases do SDD: Requisitos → Design → Tarefas
- Specs em `.kiro/specs/kiro-kanban/{versão}/`
- Código em diretório separado das specs
- Nunca gerar tudo de uma vez — sempre incremental
- Projeto deve compilar e executar ao final de cada iteração

### Ordem das Iterações

| Versão | Escopo |
|--------|--------|
| v1.0.0 | Estrutura base Angular, layout principal, rotas, Sidebar, Header |
| v2.0.0 | Estrutura do Kanban, colunas fixas: Backlog, Em Andamento, Concluído |
| v3.0.0 | Modelo de Card, serviço mock, renderização de cards, arrastar e soltar |
| v4.0.0 | Criação, edição e exclusão de cards (CRUD completo) |

### Funcionalidades Principais

**Kanban:** Colunas fixas (Backlog / Em Andamento / Concluído), arrastar e soltar entre colunas, atualização automática da UI via Signals.

**Cards:** Campos: `id`, `titulo`, `descricao`, `prioridade` (`baixa`/`média`/`alta`), `status` (`backlog`/`in-progress`/`done`). Operações: criar, editar, excluir.

### Instrução de Execução

1. Crie os diretórios `.kiro/specs/kiro-kanban/v1.0.0/`, `v2.0.0/`, `v3.0.0/` e `v4.0.0/`
2. Para cada versão, crie `requirements.md` e `.config.kiro`
3. Os requisitos devem seguir o padrão EARS/INCOSE: user stories + critérios de aceitação mensuráveis e testáveis
4. Cada critério deve ser verificável de forma independente — sem termos vagos como "visível" sem definição concreta
5. Refine cada requisito para eliminar ambiguidades antes de avançar para o design

---

## PASSO 3 — Próximos Passos (após o setup)

Com os arquivos de steering e os requisitos criados, o fluxo natural é:

1. **Design v1.0.0** — criar `.kiro/specs/kiro-kanban/v1.0.0/design.md`
2. **Tarefas v1.0.0** — criar `.kiro/specs/kiro-kanban/v1.0.0/tasks.md`
3. **Implementar v1.0.0** — criar o projeto Angular em `kiro-kanban/`
4. Repetir o ciclo para v2.0.0, v3.0.0 e v4.0.0

---

## Referência — Estrutura Final Esperada

```
.kiro/
├── steering/
│   ├── product.md
│   ├── tech.md
│   ├── structure.md
│   └── workflow.md
└── specs/
    └── kiro-kanban/
        ├── v1.0.0/
        │   ├── .config.kiro
        │   ├── requirements.md
        │   ├── design.md        ← próxima fase
        │   └── tasks.md         ← próxima fase
        ├── v2.0.0/
        │   └── ...
        ├── v3.0.0/
        │   └── ...
        └── v4.0.0/
            └── ...

kiro-kanban/                     ← código da aplicação (criado na implementação)
└── src/
    └── app/
        ├── domain/
        ├── adapters/
        ├── app.routes.ts
        └── app.component.ts
```
