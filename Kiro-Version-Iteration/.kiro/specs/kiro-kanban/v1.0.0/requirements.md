# Requirements Document — v1.0.0

## Introduction

A iteração **v1.0.0** estabelece a estrutura base do aplicativo **Kiro-Version-Iteration**, um SPA Angular para uso interno. O objetivo desta entrega é criar o esqueleto funcional da aplicação: layout principal com Header e Sidebar, sistema de rotas com Angular Router e a rota inicial do Kanban. Ao final desta iteração, a aplicação deve compilar, executar e exibir o layout estrutural com navegação funcional.

---

## Glossary

- **Application**: O sistema frontend SPA Kiro-Version-Iteration como um todo.
- **Router**: O Angular Router responsável pelo roteamento entre as páginas da Application.
- **Sidebar**: Componente de navegação lateral da Application, exibindo links para as rotas disponíveis.
- **Header**: Componente de cabeçalho da Application, exibindo o nome do sistema e o título da rota ativa.
- **Layout_Shell**: O componente raiz (`AppComponent`) que compõe Header, Sidebar e área de conteúdo principal.
- **Kanban_Placeholder**: Componente temporário que ocupa a rota `/kanban` nesta iteração, sem lógica de negócio.
- **Standalone_Component**: Componente Angular declarado com `standalone: true`, sem pertencer a nenhum NgModule.

---

## Requirements

### Requirement 1: Layout Principal

**User Story:** Como usuário interno, quero acessar o sistema e ver um layout consistente com cabeçalho e navegação lateral, para que eu possa orientar-me na aplicação desde o primeiro acesso.

#### Acceptance Criteria

1. WHEN a Application é inicializada, THE Layout_Shell SHALL renderizar o Header, a Sidebar e a área de conteúdo principal simultaneamente, de modo que todos os três elementos estejam presentes no DOM e visíveis na viewport sem necessidade de rolagem.
2. THE Layout_Shell SHALL utilizar exclusivamente Standalone Components (declarados com `standalone: true`), sem declaração de nenhum componente em NgModules.
3. THE Header SHALL exibir o texto exato `Kiro-Version-Iteration` como conteúdo de texto visível no topo da tela, não oculto por `display: none`, `visibility: hidden` ou `opacity: 0`.
4. THE Sidebar SHALL ser renderizada à esquerda da área de conteúdo principal, ocupando 100% da altura disponível da viewport (altura mínima igual à altura da janela do navegador).
5. THE Layout_Shell SHALL utilizar SCSS para estilização do layout, sem nenhum atributo `style` inline nos elementos do template HTML.

---

### Requirement 2: Sistema de Rotas

**User Story:** Como usuário interno, quero que a aplicação redirecione automaticamente para o quadro Kanban ao acessar a URL raiz, para que eu chegue diretamente ao conteúdo principal sem precisar navegar manualmente.

#### Acceptance Criteria

1. THE Router SHALL definir uma rota `/kanban` que renderiza o Kanban_Placeholder dentro do elemento `router-outlet` na área de conteúdo principal do Layout_Shell.
2. WHEN o usuário acessa a URL raiz `/`, THE Router SHALL redirecionar automaticamente para `/kanban`, de modo que a URL exibida no navegador seja `/kanban` após o carregamento.
3. IF uma rota inexistente for acessada, THEN THE Router SHALL redirecionar o usuário para `/kanban`, de modo que a URL exibida no navegador seja `/kanban` após o redirecionamento.
4. WHEN a rota `/kanban` é ativada, THE Header SHALL exibir o texto `Kanban` como título da rota ativa, posicionado na mesma linha que o nome da Application `Kiro-Version-Iteration`.
5. THE Router SHALL utilizar URLs sem fragmento `#` (sem hash), de modo que a URL da rota `/kanban` seja exibida como `/kanban` e não como `/#/kanban`.

---

### Requirement 3: Navegação pela Sidebar

**User Story:** Como usuário interno, quero ver os links de navegação na Sidebar, para que eu possa acessar as seções da aplicação de forma direta.

#### Acceptance Criteria

1. WHEN a Application é carregada, THE Sidebar SHALL exibir ao menos um link de navegação para a rota `/kanban` com o rótulo visível `Kanban`.
2. WHEN o usuário clica em um link da Sidebar, THE Router SHALL navegar para a rota correspondente sem recarregar a página, de modo que a URL mude sem um reload completo do browser.
3. WHEN uma rota está ativa, THE Sidebar SHALL aplicar a classe CSS `active` ao elemento do link correspondente à rota ativa, de modo que links inativos não possuam essa classe, permitindo verificação programática do estado ativo.
4. THE Sidebar SHALL utilizar o componente `mat-nav-list` do Angular Material para renderizar a lista de links de navegação.

---

### Requirement 4: Qualidade Técnica — v1.0.0

**User Story:** Como desenvolvedor, quero que a estrutura base siga os padrões técnicos definidos, para que as iterações seguintes possam ser construídas sobre uma fundação sólida e consistente.

#### Acceptance Criteria

1. THE Application SHALL seguir a arquitetura Hexagonal desde a v1.0.0, com os diretórios `src/app/domain/`, `src/app/domain/models/`, `src/app/domain/ports/`, `src/app/adapters/`, `src/app/adapters/components/` e `src/app/adapters/services/` criados e presentes no sistema de arquivos ao final da iteração, mesmo que ainda sem arquivos de lógica de negócio.
2. THE Application SHALL compilar sem erros TypeScript ao final da v1.0.0, definido como execução de `ng build` sem nenhuma linha de erro na saída do processo.
3. WHEN a Application é carregada no navegador e a rota `/kanban` é acessada, THE Application SHALL não emitir nenhum erro no console do navegador (sem `console.error` ou exceções não tratadas no painel DevTools).
4. THE Application SHALL utilizar Angular Material com um tema pré-construído configurado no arquivo `styles.scss`, evidenciado pela presença de uma linha `@use '@angular/material' as mat` ou equivalente de importação de tema no arquivo `styles.scss`.
5. THE Application SHALL utilizar SCSS como único mecanismo de estilização, com um arquivo `styles.scss` global para variáveis, temas e resets, sem nenhum atributo `style` inline nos templates de componentes.

