# Requirements Document — v4.0.0

## Introduction

A iteração **v4.0.0** completa o ciclo CRUD do aplicativo **Kiro-Version-Iteration**, adicionando as funcionalidades de criação, edição e exclusão de cards. O objetivo é permitir que o usuário gerencie o ciclo de vida completo de um card diretamente no quadro Kanban, por meio de um formulário reativo (`Card_Form`) exibido em modal ou painel lateral.

Esta iteração é incremental sobre a v3.0.0: o layout, rotas, colunas, renderização de cards e drag and drop já existem. O foco é adicionar as operações de escrita (criar, editar, excluir) ao `Card_Service` e expô-las via `Card_Form`.

---

## Glossary

- **Application**: O sistema frontend SPA Kiro-Version-Iteration como um todo.
- **Kanban_Board**: O componente principal que exibe as Columns e os Cards do quadro Kanban.
- **Column**: Uma das três colunas fixas do quadro: `Backlog`, `In Progress` ou `Done`.
- **Card**: Unidade de trabalho exibida dentro de uma Column, contendo `id`, `titulo`, `descricao`, `prioridade` e `status`.
- **Card_Form**: Formulário reativo (Reactive Form) utilizado para criação e edição de Cards, exibido em modal ou painel lateral.
- **Card_Service**: Serviço mock responsável por fornecer, criar, atualizar e excluir Cards em memória, implementando a interface `CardServicePort`.
- **CardServicePort**: Interface de porta do domínio que define o contrato completo do Card_Service, incluindo operações de escrita.
- **Priority**: Nível de prioridade de um Card. Valores possíveis: `baixa`, `média`, `alta`.
- **Status**: Estado atual de um Card, correspondente à Column em que se encontra. Valores possíveis: `backlog`, `in-progress`, `done`.
- **Signal**: Primitiva reativa do Angular Signals utilizada para gerenciar estado da UI.
- **Confirmation_Dialog**: Diálogo de confirmação exibido ao usuário antes de uma operação destrutiva (exclusão de Card).

---

## Requirements

### Requirement 1: Criação de Cards

**User Story:** Como usuário interno, quero criar novos cards no quadro Kanban, para que eu possa registrar novas tarefas no fluxo de trabalho.

#### Acceptance Criteria

1. THE Kanban_Board SHALL disponibilizar um botão ou ação visível renderizado na viewport sem necessidade de rolagem para iniciar a criação de um novo Card.
2. WHEN o usuário aciona a criação de um novo Card, THE Card_Form SHALL ser exibido em um modal ou painel lateral com os campos: `titulo` (obrigatório, máximo 100 caracteres), `descricao` (opcional, máximo 500 caracteres quando preenchido) e `prioridade` (obrigatório, valores: `baixa`, `média`, `alta`).
3. THE Card_Form SHALL validar que `titulo` não está vazio e não excede 100 caracteres, e que `prioridade` é um dos valores válidos (`baixa`, `média`, `alta`); o campo `descricao` é opcional.
4. IF o usuário tentar submeter o Card_Form com o campo `titulo` vazio ou com `prioridade` não selecionada, THEN THE Card_Form SHALL exibir mensagens de erro de validação inline para cada campo inválido e o botão de submissão SHALL permanecer desabilitado ou a submissão SHALL ser bloqueada.
5. WHEN o usuário submete o Card_Form com dados válidos, THE Card_Service SHALL criar um novo Card com `status` igual a `backlog` e um `id` único gerado automaticamente.
6. WHEN o Card_Service cria um novo Card com sucesso, THE Card_Form SHALL ser fechado automaticamente.
7. WHEN um novo Card é criado pelo Card_Service, THE Kanban_Board SHALL exibir o Card na Column `Backlog` em até 500ms sem recarregar a página.
8. IF ocorrer uma falha ao criar o Card no Card_Service, THEN THE Card_Form SHALL permanecer aberto com os dados preenchidos pelo usuário e exibir uma mensagem de erro indicando que a operação de criação falhou.

---

### Requirement 2: Edição de Cards

**User Story:** Como usuário interno, quero editar as informações de um card existente, para que eu possa corrigir ou atualizar os dados de uma tarefa.

#### Acceptance Criteria

1. THE Card SHALL disponibilizar um botão ou ação visível renderizado na viewport sem necessidade de rolagem para iniciar a edição do Card.
2. WHEN o usuário aciona a edição de um Card, THE Card_Form SHALL ser exibido preenchido com os valores atuais dos campos `titulo`, `descricao` e `prioridade` do Card selecionado.
3. WHEN o usuário submete o Card_Form com dados válidos durante a edição (`titulo` não vazio e com no máximo 100 caracteres, `descricao` com no máximo 500 caracteres, `prioridade` ∈ {`baixa`, `média`, `alta`}), THE Card_Service SHALL atualizar os campos `titulo`, `descricao` e `prioridade` do Card correspondente.
4. WHEN o Card_Service atualiza um Card com sucesso, THE Card_Form SHALL ser fechado automaticamente.
5. IF o usuário tentar submeter o Card_Form durante a edição com dados inválidos, THEN THE Card_Form SHALL permanecer aberto e exibir mensagens de erro de validação inline para cada campo inválido.
6. WHEN o Card_Service atualiza um Card, THE Kanban_Board SHALL exibir os novos valores de `titulo`, `descricao` e `prioridade` no Card correspondente em até 500ms sem recarregar a página.
7. IF ocorrer uma falha ao salvar a edição no Card_Service, THEN THE Card_Form SHALL permanecer aberto com os dados editados pelo usuário e exibir uma mensagem de erro indicando que a operação de salvamento falhou.
8. IF o usuário cancelar a edição, THEN THE Card_Form SHALL ser fechado sem alterar os campos `titulo`, `descricao` e `prioridade` do Card.

---

### Requirement 3: Exclusão de Cards

**User Story:** Como usuário interno, quero excluir cards do quadro Kanban, para que eu possa remover tarefas que não são mais relevantes.

#### Acceptance Criteria

1. THE Card SHALL disponibilizar um botão ou ação visível renderizado na viewport sem necessidade de rolagem para iniciar a exclusão do Card.
2. WHEN o usuário aciona a exclusão de um Card, THE Application SHALL exibir um Confirmation_Dialog com texto de confirmação visível, solicitando que o usuário confirme a ação antes de prosseguir.
3. WHEN o usuário confirma a exclusão no Confirmation_Dialog, THE Card_Service SHALL remover o Card do estado em memória (o Card não deve mais estar presente no Signal de Cards).
4. WHEN o Card_Service remove um Card, THE Kanban_Board SHALL remover o elemento do Card da Column correspondente em até 500ms, de modo que o Card não seja mais visível no DOM.
5. WHEN o Card_Service remove um Card, THE Kanban_Board SHALL atualizar o número exibido no Card_Count da Column afetada em até 500ms após a remoção.
6. IF o usuário cancelar o Confirmation_Dialog, THEN THE Card_Service SHALL manter o Card sem alterações e o Card SHALL permanecer visível na Column.
7. IF ocorrer uma falha ao remover o Card no Card_Service, THEN THE Application SHALL exibir uma mensagem de erro visível ao usuário e o Card SHALL permanecer visível na Column correspondente.

---

### Requirement 4: Formulário Reativo (Card_Form)

**User Story:** Como desenvolvedor, quero que o formulário de criação e edição utilize Angular Reactive Forms, para que a validação e o estado do formulário sejam gerenciados de forma consistente e testável.

#### Acceptance Criteria

1. THE Card_Form SHALL ser implementado utilizando Angular Reactive Forms com `FormGroup`, `FormControl` e `Validators`, de modo que nenhuma lógica de validação seja implementada fora do `FormGroup`.
2. THE Card_Form SHALL ser implementado como Standalone Component no arquivo `src/app/adapters/components/card-form/card-form.component.ts`, com um arquivo SCSS dedicado `card-form.component.scss`.
3. THE Card_Form SHALL utilizar `mat-form-field`, `mat-select` e `mat-button` do Angular Material para os elementos de UI do formulário.
4. WHEN o Card_Form é aberto para criação, THE Card_Form SHALL inicializar com todos os campos (`titulo`, `descricao`, `prioridade`) com valor vazio ou nulo.
5. WHEN o Card_Form é aberto para edição, THE Card_Form SHALL inicializar com os valores atuais do Card sendo editado nos campos `titulo`, `descricao` e `prioridade`.
6. THE Card_Form SHALL exibir mensagens de erro de validação como elementos de texto visíveis imediatamente abaixo do campo inválido, de modo que cada mensagem de erro esteja associada visualmente ao campo correspondente.
7. WHEN o Card_Form é fechado (por submissão bem-sucedida ou cancelamento), THE Card_Form SHALL chamar `FormGroup.reset()` para limpar todos os campos, de modo que uma reabertura subsequente não exiba valores residuais.

---

### Requirement 5: Reatividade e Consistência de Estado — CRUD

**User Story:** Como usuário interno, quero que o quadro Kanban reflita imediatamente qualquer criação, edição ou exclusão de card, para que eu não precise recarregar a página para ver as atualizações.

#### Acceptance Criteria

1. WHEN qualquer operação de criação, edição ou exclusão de Card é realizada com sucesso, THE Kanban_Board SHALL atualizar a UI automaticamente em até 500ms sem recarregar a página.
2. WHEN qualquer operação de criação, edição ou exclusão de Card é realizada, THE Kanban_Board SHALL exibir cada Card exclusivamente na Column correspondente ao seu `status` atual, sem duplicatas no DOM.
3. WHILE o Kanban_Board estiver visível, THE Kanban_Board SHALL manter o Card_Count de cada Column sincronizado com o número real de Cards com aquele `status` em até 500ms após qualquer operação de criação, edição ou exclusão.
4. IF ocorrer uma inconsistência de estado durante uma atualização reativa (por exemplo, um Card exibido em mais de uma Column ou Card_Count incorreto), THEN THE Application SHALL exibir uma mensagem de erro visível ao usuário e restaurar o estado para o snapshot imediatamente anterior à operação que causou a inconsistência.

---

### Requirement 6: Qualidade Técnica — v4.0.0

**User Story:** Como desenvolvedor, quero que a iteração v4.0.0 complete o ciclo CRUD mantendo todos os padrões técnicos das iterações anteriores, para que o projeto esteja pronto para uso interno com funcionalidade completa.

#### Acceptance Criteria

1. THE Application SHALL compilar sem erros TypeScript ao final da v4.0.0, definido como execução de `ng build` sem nenhuma linha de erro na saída do processo.
2. WHEN a Application é carregada no navegador e a rota `/kanban` é acessada, THE Application SHALL não emitir nenhuma exceção JavaScript não tratada nem chamada a `console.error` no painel DevTools do navegador.
3. THE CardServicePort SHALL declarar explicitamente os métodos `addCard()`, `updateCard()` e `deleteCard()`, e THE Card_Service SHALL implementar todos esses métodos de modo que cada um atualize o Signal interno de Cards.
4. THE camada `src/app/domain/` SHALL não conter nenhum import de arquivos localizados em `src/app/adapters/` ou em qualquer outro diretório externo ao domínio.
5. THE Card_Form SHALL ser implementado como Standalone Component (declarado com `standalone: true`), sem declaração em nenhum NgModule.
6. THE Card_Form e o Confirmation_Dialog SHALL utilizar exclusivamente componentes do Angular Material para todos os elementos interativos (campos, botões, diálogos), sem uso de elementos HTML nativos não estilizados pelo Angular Material.

