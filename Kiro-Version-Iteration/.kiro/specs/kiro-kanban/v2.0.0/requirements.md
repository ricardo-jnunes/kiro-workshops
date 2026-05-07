# Requirements Document — v2.0.0

## Introduction

A iteração **v2.0.0** introduz a estrutura visual do quadro Kanban no aplicativo **Kiro-Version-Iteration**. O objetivo é substituir o `Kanban_Placeholder` da v1.0.0 pelo componente `Kanban_Board` funcional, exibindo as três colunas fixas (Backlog, In Progress, Done) com seus cabeçalhos e contadores. Nesta iteração não há cards reais — as colunas são exibidas vazias com mensagem de estado vazio. O estado é gerenciado com Angular Signals.

Esta iteração é incremental sobre a v1.0.0: o layout, rotas e navegação já existem e não são alterados.

---

## Glossary

- **Application**: O sistema frontend SPA Kiro-Version-Iteration como um todo.
- **Kanban_Board**: O componente principal que exibe as três Columns do quadro Kanban.
- **Column**: Uma das três colunas fixas do quadro: `Backlog`, `In Progress` ou `Done`.
- **Column_Header**: Área superior de cada Column que exibe o nome da Column e a contagem de Cards.
- **Signal**: Primitiva reativa do Angular Signals utilizada para gerenciar estado da UI.
- **Card_Count**: Número inteiro não-negativo que representa a quantidade de Cards em uma Column.
- **Empty_State**: Mensagem exibida em uma Column quando ela não possui Cards.

---

## Requirements

### Requirement 1: Estrutura do Quadro Kanban

**User Story:** Como usuário interno, quero visualizar o quadro Kanban com suas três colunas fixas, para que eu possa ter uma visão geral do fluxo de trabalho da equipe.

#### Acceptance Criteria

1. THE Kanban_Board SHALL exibir exatamente três Columns na seguinte ordem da esquerda para a direita: `Backlog`, `In Progress`, `Done`, verificável pela posição dos elementos no DOM.
2. IF as três Columns estiverem vazias, THEN THE Kanban_Board SHALL renderizar as três Columns simultaneamente no DOM, de modo que todos os três elementos de coluna estejam presentes no DOM ao mesmo tempo.
3. WHILE o Kanban_Board estiver visível, THE Kanban_Board SHALL manter as três Columns presentes no DOM independentemente de estarem vazias ou preenchidas, sem remover nenhum elemento de coluna do DOM.
4. THE Kanban_Board SHALL declarar o estado das Columns utilizando `signal()` ou `computed()` do Angular Signals, de modo que nenhuma propriedade de estado de coluna seja declarada como campo de classe simples sem reatividade de Signal.
5. THE Kanban_Board SHALL exibir o título de cada Column (`Backlog`, `In Progress`, `Done`) como texto visível no DOM, não oculto por `display: none`, `visibility: hidden` ou `opacity: 0`.

---

### Requirement 2: Cabeçalho das Colunas

**User Story:** Como usuário interno, quero ver o nome e a contagem de tarefas de cada coluna, para que eu possa identificar rapidamente o volume de trabalho em cada etapa do fluxo.

#### Acceptance Criteria

1. THE Column_Header SHALL exibir o nome da Column como texto visível no DOM, não oculto por `display: none`, `visibility: hidden`, `opacity: 0` ou `overflow: hidden` com dimensão zero, e com comprimento máximo de 50 caracteres visíveis.
2. THE Column_Header SHALL exibir o Card_Count da Column como um número inteiro não-negativo, exibindo o valor `0` quando a Column não possuir Cards.
3. WHEN o Card_Count de uma Column é alterado, THE Column_Header SHALL atualizar o número exibido em até 500ms, sem recarregar a página.
4. THE Column_Header SHALL utilizar o componente `mat-card` ou `mat-toolbar` do Angular Material para renderizar o cabeçalho da coluna.

---

### Requirement 3: Estado Vazio das Colunas

**User Story:** Como usuário interno, quero ver uma mensagem quando uma coluna não possui tarefas, para que eu saiba que a coluna está vazia e não que houve um erro de carregamento.

#### Acceptance Criteria

1. IF uma Column não possuir Cards, THEN THE Kanban_Board SHALL exibir um elemento de texto visível dentro da Column com o conteúdo "Nenhuma tarefa nesta coluna", não oculto por `display: none`, `visibility: hidden` ou `opacity: 0`.
2. THE Empty_State SHALL incluir o nome da Column no contexto visual imediato (no mesmo elemento pai ou em elemento adjacente visível), de modo que o usuário identifique a qual Column a mensagem pertence sem ambiguidade.
3. WHEN Cards forem adicionados a uma Column, THE Kanban_Board SHALL remover o elemento de Empty_State daquela Column automaticamente em até 500ms, sem recarregar a página.
4. WHEN todos os Cards de uma Column forem removidos, THE Kanban_Board SHALL exibir novamente o elemento de Empty_State naquela Column automaticamente em até 500ms, sem recarregar a página.

---

### Requirement 4: Reatividade com Angular Signals

**User Story:** Como desenvolvedor, quero que o estado do quadro Kanban seja gerenciado com Angular Signals, para que a UI reaja automaticamente a mudanças de estado sem necessidade de detecção de mudanças manual.

#### Acceptance Criteria

1. THE Kanban_Board SHALL declarar o estado das Columns e dos Cards utilizando `signal()` ou `computed()` do Angular Signals, de modo que nenhuma propriedade de estado seja declarada como campo de classe simples sem reatividade de Signal.
2. WHEN o estado de uma Column ou de um Card é alterado via Signal, THE Kanban_Board SHALL refletir a mudança na UI automaticamente sem chamadas manuais a `ChangeDetectorRef.detectChanges()` ou `ChangeDetectorRef.markForCheck()`.
3. THE Kanban_Board SHALL declarar `changeDetection: ChangeDetectionStrategy.OnPush` nos metadados do componente, de modo que a estratégia de detecção de mudanças seja explicitamente configurada como `OnPush`.

---

### Requirement 5: Qualidade Técnica — v2.0.0

**User Story:** Como desenvolvedor, quero que a iteração v2.0.0 mantenha os padrões técnicos da v1.0.0 e adicione a estrutura do Kanban de forma consistente, para que o projeto continue compilando e executando corretamente.

#### Acceptance Criteria

1. THE Application SHALL compilar sem erros TypeScript ao final da v2.0.0, definido como execução de `ng build` sem nenhuma linha de erro na saída do processo.
2. WHEN a Application é carregada no navegador e a rota `/kanban` é acessada, THE Application SHALL não emitir nenhum erro no console do navegador (sem `console.error` ou exceções não tratadas no painel DevTools).
3. THE Kanban_Board SHALL ser implementado como Standalone Component (declarado com `standalone: true`), sem declaração em nenhum NgModule.
4. THE Kanban_Board SHALL importar apenas os módulos Angular Material necessários para sua renderização, de modo que nenhum módulo Angular Material não utilizado pelo template do Kanban_Board esteja presente no array `imports` do componente.
5. IF ocorrer uma exceção durante a inicialização do estado do Kanban_Board, THEN THE Application SHALL exibir um elemento de texto visível com uma mensagem de erro ao usuário e manter os três elementos de Column presentes no DOM.

