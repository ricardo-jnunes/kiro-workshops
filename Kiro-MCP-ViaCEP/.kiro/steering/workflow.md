# Fluxo de Trabalho

Este projeto segue **Spec-Driven Development (SDD)** com entregas iterativas incrementais.

## Regras de Processo

1. As entregas são feitas de forma iterativa (versões semânticas)
2. Definir primeiro as interfaces, modelos e contratos antes de implementar
3. Implementar em pequenas entregas funcionais
4. Validar cada etapa antes de avançar para a próxima
5. Nunca gerar toda a aplicação de uma vez
6. O servidor deve compilar e executar ao final de cada iteração
7. Cada entrega deve ser pequena, funcional e testável de forma independente

## Spec-Driven Development (SDD)

Cada iteração segue obrigatoriamente as **3 fases do SDD**:

1. **Requisitos** — User stories e critérios de aceitação (padrão EARS/INCOSE)
2. **Design** — Arquitetura, módulos, interfaces e decisões técnicas
3. **Tarefas** — Lista de tarefas de implementação derivadas do design

Não avançar para a fase seguinte sem completar e validar a fase atual.

## Estrutura de Diretórios de Especificação

```
.kiro/specs/{nome-do-projeto}/{versão-semântica}/
  requirements.md
  design.md
  tasks.md
  .config.kiro
```

**Exemplos:**
- `.kiro/specs/viacep-mcp/v1.0.0/`
- `.kiro/specs/viacep-mcp/v1.1.0/`

## Ordem das Iterações

| Versão | Escopo |
|--------|--------|
| v1.0.0 | Servidor MCP base: refatoração em camadas, ferramentas e recursos existentes |
| v1.1.0 | Melhorias: cache, tratamento de erros aprimorado, novos recursos MCP |
