# Kiro Workshops

Repositório com prompts e material de estudo para uso do **Kiro IDE** — AI-powered development environment.

---

## Workshops Disponíveis

| Workshop | Descrição | Status |
|---|---|---|
| [Kiro Kanban](#kiro-kanban-workshop) | SPA Angular com Kanban board seguindo Spec-Driven Development iterativo | 🚧 Em andamento |
| [Kiro MCP ViaCEP](#kiro-mcp-viacep-workshop) | Servidor MCP para consulta de CEPs brasileiros via API ViaCEP | ✅ Disponível |

---

## Kiro Kanban Workshop

Workshop prático demonstrando como o Kiro auxilia na construção de um aplicativo Kanban em Angular seguindo **Spec-Driven Development (SDD)** com entregas iterativas e incrementais.

📁 [Kiro-Version-Iteration/](./Kiro-Version-Iteration/README.md)

**Stack:** Angular 21+ · Standalone Components · Angular Signals · Angular Material · Arquitetura Hexagonal

| Versão | Escopo | Specs | Código |
|---|---|---|---|
| v1.0.0 | Layout base, rotas, Header, Sidebar | ✅ | ✅ |
| v2.0.0 | Quadro Kanban, 3 colunas fixas, Signals | ✅ | ⏳ |
| v3.0.0 | Modelo Card, mock service, drag and drop | ✅ | ⏳ |
| v4.0.0 | CRUD completo: criar, editar, excluir cards | ✅ | ⏳ |

---

## Kiro MCP ViaCEP Workshop

Workshop demonstrando como construir um **servidor MCP (Model Context Protocol)** com Kiro, integrando ferramentas de IA à API pública ViaCEP para consulta de endereços brasileiros.

📁 [Kiro-MCP-ViaCEP/](./Kiro-MCP-ViaCEP/README.md)

**Stack:** Node.js 18+ · TypeScript · MCP SDK · Docker

| Ferramenta | Descrição |
|---|---|
| `getAddressByCEP` | Retorna endereço completo a partir de um CEP |
| `getCEPByAddress` | Busca CEPs a partir de UF, cidade e logradouro |

---

## Sobre o Kiro IDE

[Kiro](https://kiro.dev) é um AI-powered development environment com dois modos de trabalho:

- **Vibe** — conversacional, para exploração e Q&A
- **Spec** — estruturado, seguindo o ciclo Requisitos → Design → Tarefas → Implementação

Os **steering files** (`.kiro/steering/`) são incluídos automaticamente em toda sessão, garantindo que o assistente sempre siga as convenções do projeto.

Os **MCP servers** (`.kiro/settings/mcp.json`) estendem as capacidades do Kiro com ferramentas externas, como consulta de CEPs, acesso a bancos de dados, APIs REST e muito mais.

---

## Licença

Material educacional de uso livre.
