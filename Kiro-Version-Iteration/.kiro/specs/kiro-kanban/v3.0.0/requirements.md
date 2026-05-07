# Requirements Document — v3.0.0

## Introduction

A iteração **v3.0.0** introduz o modelo de dados `Card`, o serviço mock `Card_Service`, a renderização de cards nas colunas e a funcionalidade de drag and drop entre colunas no aplicativo **Kiro-Version-Iteration**. O objetivo é tornar o quadro Kanban funcional com dados reais em memória e permitir que o usuário mova cards entre colunas arrastando e soltando.

Esta iteração é incremental sobre a v2.0.0: o layout, rotas, navegação e estrutura de colunas já existem. O foco é adicionar dados, renderização de cards e interatividade via drag and drop.

---

## Glossary

- **Application**: O sistema frontend SPA Kiro-Version-Iteration como um todo.
- **Kanban_Board**: O componente principal que exibe as Columns e os Cards do quadro Kanban.
- **Column**: Uma das três colunas fixas do quadro: `Backlog`, `In Progress` ou `Done`.
- **Card**: Unidade de trabalho exibida dentro de uma Column, contendo `id`, `titulo`, `descricao`, `prioridade` e `status`.
- **Card_Service**: Serviço mock responsável por fornecer e atualizar Cards em memória, implementando a interface `CardServicePort`.
- **CardServicePort**: Interface de porta do domínio que define o contrato do Card_Service.
- **Drag_Drop_Service**: Lógica de movimentação de Cards entre Columns via drag and drop, utilizando `@angular/cdk/drag-drop`.
- **Priority**: Nível de prioridade de um Card. Valores possíveis: `baixa`, `média`, `alta`.
- **Status**: Estado atual de um Card, correspondente à Column em que se encontra. Valores possíveis: `backlog`, `in-progress`, `done`.
- **Signal**: Primitiva reativa do Angular Signals utilizada para gerenciar estado da UI.
- **Drop_Zone**: Área visual de uma Column que aceita Cards arrastados, destacada durante o arrasto.

---

## Requirements

### Requirement 1: Modelo de Dados Card

**User Story:** Como desenvolvedor, quero um modelo de dados bem definido para os cards, para que todos os componentes e serviços utilizem a mesma estrutura de dados consistente.

#### Acceptance Criteria

1. THE Card SHALL conter os seguintes campos obrigatórios: `id` (string única), `titulo` (string de 1 a 100 caracteres), `descricao` (string de 0 a 500 caracteres), `prioridade` (Priority com valores `baixa`, `média` ou `alta`), `status` (Status com valores `backlog`, `in-progress` ou `done`).
2. THE Card SHALL ser definido como interface TypeScript no arquivo `src/app/domain/models/card.model.ts`, sem nenhum import de arquivos localizados em `src/app/adapters/`.
3. THE Priority SHALL ser definido como tipo TypeScript (`type` ou `enum`) no arquivo `src/app/domain/models/priority.model.ts`, com os valores exatos: `baixa`, `média`, `alta`.
4. THE Status SHALL ser definido como tipo TypeScript (`type` ou `enum`) no arquivo `src/app/domain/models/status.model.ts`, com os valores exatos: `backlog`, `in-progress`, `done`.
5. THE CardServicePort SHALL ser definido como interface TypeScript no arquivo `src/app/domain/ports/card-service.port.ts`, declarando explicitamente os métodos `getCards()`, `addCard()`, `updateCard()` e `deleteCard()` que o Card_Service deve implementar.

---

### Requirement 2: Card Service Mock

**User Story:** Como desenvolvedor, quero um serviço mock que forneça dados de cards em memória, para que o quadro Kanban possa ser renderizado com dados reais sem necessidade de backend.

#### Acceptance Criteria

1. THE Card_Service SHALL implementar a interface `CardServicePort` definida em `src/app/domain/ports/card-service.port.ts`, de modo que a declaração da classe inclua `implements CardServicePort`.
2. WHEN o Card_Service é inicializado, THE Card_Service SHALL fornecer uma lista inicial de no mínimo 3 Cards mockados em memória, com ao menos um Card com `status: 'backlog'`, um com `status: 'in-progress'` e um com `status: 'done'`.
3. THE Card_Service SHALL armazenar o estado dos Cards utilizando `signal()` do Angular Signals, de modo que o campo de estado interno seja declarado com `signal<Card[]>(...)` e não como array simples.
4. THE Card_Service SHALL expor os Cards por meio de uma propriedade do tipo `Signal<Card[]>` ou `computed()`, de modo que os componentes consumidores leiam o valor sem chamar `.subscribe()`.
5. THE Card_Service SHALL ser registrado como provider no arquivo `src/app/adapters/services/card.service.ts`, sem nenhum import desse arquivo na camada `src/app/domain/`.
6. THE Card_Service SHALL implementar os métodos `addCard()`, `updateCard()` e `deleteCard()` declarados em `CardServicePort`, de modo que cada método atualize o Signal interno de Cards e a mudança seja propagada automaticamente para os componentes consumidores.

---

### Requirement 3: Renderização de Cards nas Colunas

**User Story:** Como usuário interno, quero visualizar os cards dentro das colunas correspondentes ao seu status, para que eu possa identificar rapidamente as tarefas em cada etapa do fluxo de trabalho.

#### Acceptance Criteria

1. WHEN o Kanban_Board é renderizado, THE Kanban_Board SHALL exibir cada Card exclusivamente na Column correspondente ao seu campo `status`, de modo que nenhum Card apareça em mais de uma Column ao mesmo tempo no DOM.
2. WHEN um Card é renderizado em uma Column, THE Card SHALL exibir o `titulo`, a `descricao` e a `prioridade` como elementos de texto visíveis no DOM, não ocultos por `display: none`, `visibility: hidden` ou `opacity: 0`.
3. WHEN um Card é renderizado em uma Column, THE Card SHALL exibir a `prioridade` com um indicador visual distinto (cor de fundo, cor de texto ou ícone diferente) para cada valor possível (`baixa`, `média`, `alta`), de modo que nenhum dois valores de prioridade compartilhem exatamente o mesmo conjunto de propriedades visuais.
4. IF uma Column não possuir Cards, THEN THE Kanban_Board SHALL exibir um elemento de texto visível com o conteúdo "Nenhuma tarefa nesta coluna" dentro da Column, não oculto por `display: none`, `visibility: hidden` ou `opacity: 0`.
5. THE Card SHALL ser implementado como Standalone Component no arquivo `src/app/adapters/components/kanban-card/kanban-card.component.ts`, com um arquivo SCSS dedicado `kanban-card.component.scss`.
6. WHEN o estado dos Cards é alterado via Signal no Card_Service, THE Kanban_Board SHALL atualizar a renderização dos Cards automaticamente em até 500ms, sem recarregar a página.

---

### Requirement 4: Drag and Drop entre Colunas

**User Story:** Como usuário interno, quero mover cards entre as colunas arrastando e soltando, para que eu possa atualizar o status das tarefas de forma visual e rápida.

#### Acceptance Criteria

1. THE Kanban_Board SHALL utilizar o módulo `DragDropModule` de `@angular/cdk/drag-drop` para implementar a funcionalidade de arrastar e soltar Cards entre Columns.
2. WHEN o usuário arrasta um Card e o solta em uma Column diferente, THE Card_Service SHALL atualizar o campo `status` do Card para o Status correspondente à Column de destino.
3. WHEN o `status` de um Card é atualizado pelo Card_Service, THE Kanban_Board SHALL mover o Card visualmente para a Column correta sem recarregar a página.
4. WHILE o usuário estiver arrastando um Card sobre uma Column de destino válida, THE Kanban_Board SHALL aplicar uma borda visualmente distinta ou alteração de cor de fundo na Drop_Zone da Column de destino, de modo que a mudança visual seja perceptível em comparação ao estado padrão da Column.
5. IF o usuário soltar um Card na mesma Column de origem, THEN THE Card_Service SHALL manter o Card em sua posição original sem alterar o campo `status`.
6. WHEN um Card é movido entre Columns, THE Kanban_Board SHALL atualizar o número exibido no Card_Count em ambas as Columns afetadas em até 500ms após a conclusão do movimento.
7. IF ocorrer uma exceção ao persistir a movimentação do Card no Card_Service, THEN THE Kanban_Board SHALL reverter o Card para a Column de origem e exibir uma notificação de erro visível ao usuário que persista por ao menos 3 segundos, mantendo o estado anterior do quadro.

---

### Requirement 5: Reatividade e Consistência de Estado

**User Story:** Como usuário interno, quero que o quadro Kanban reflita sempre o estado atual das tarefas após movimentações, para que eu não precise recarregar a página para ver as atualizações.

#### Acceptance Criteria

1. WHEN um Card é movido entre Columns via drag and drop, THE Kanban_Board SHALL atualizar a UI automaticamente em até 500ms sem recarregar a página.
2. WHEN um Card é movido entre Columns, THE Kanban_Board SHALL exibir o Card exclusivamente na Column correspondente ao seu `status` atualizado, de modo que o Card não apareça na Column de origem após a conclusão do movimento.
3. WHILE o Kanban_Board estiver visível, THE Kanban_Board SHALL manter o Card_Count de cada Column sincronizado com o número real de Cards com aquele `status` em até 500ms após qualquer movimentação.
4. IF ocorrer uma inconsistência de estado (por exemplo, um Card exibido em mais de uma Column), THEN THE Application SHALL exibir uma mensagem de erro ao usuário e restaurar o estado para o snapshot imediatamente anterior à operação que causou a inconsistência.
5. WHILE o usuário estiver arrastando um Card, THE Kanban_Board SHALL exibir o Card como visível apenas na Column de origem até que o drop seja confirmado, sem duplicar o elemento do Card em outra Column durante o arrasto.

---

### Requirement 6: Qualidade Técnica — v3.0.0

**User Story:** Como desenvolvedor, quero que a iteração v3.0.0 mantenha os padrões técnicos das iterações anteriores e adicione o modelo, serviço e drag and drop de forma consistente com a arquitetura Hexagonal.

#### Acceptance Criteria

1. THE Application SHALL compilar sem erros TypeScript ao final da v3.0.0, definido como execução de `ng build` sem nenhuma linha de erro na saída do processo.
2. WHEN a Application é carregada no navegador e a rota `/kanban` é acessada, THE Application SHALL não emitir nenhuma exceção JavaScript não tratada nem chamada a `console.error` no painel DevTools do navegador.
3. THE Card_Service SHALL ser injetado nos componentes consumidores por meio do token `CardServicePort` (usando `@Inject(CardServicePort)` ou `inject(CardServicePort)`), de modo que nenhum componente importe ou referencie diretamente a classe `CardService`.
4. THE camada `src/app/domain/` SHALL não conter nenhum import de arquivos localizados em `src/app/adapters/` ou em qualquer outro diretório externo ao domínio.
5. THE Card SHALL ser implementado como Standalone Component (declarado com `standalone: true`), sem declaração em nenhum NgModule.

