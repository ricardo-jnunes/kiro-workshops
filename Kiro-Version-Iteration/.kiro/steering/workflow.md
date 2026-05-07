# Workflow — Forma de Trabalho

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

1. **Requirements** — Requisitos com user stories e critérios de aceitação (EARS/INCOSE)
2. **Design** — Arquitetura, componentes, interfaces e decisões técnicas
3. **Tasks** — Lista de tarefas de implementação derivadas do design

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

O código da aplicação fica em diretório separado das especificações (ex: `kiro-kanban/` na raiz do workspace).

## Ordem das Iterações — Kiro Kanban

| Versão | Escopo |
|--------|--------|
| v1.0.0 | Estrutura base Angular, layout, rotas, Sidebar, Header |
| v2.0.0 | Quadro Kanban, colunas fixas (Backlog, In Progress, Done) |
| v3.0.0 | Model de Card, mock service, renderização, drag and drop |
| v4.0.0 | Criação, edição e exclusão de cards (CRUD completo) |
