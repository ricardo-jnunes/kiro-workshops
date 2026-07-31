# Kiro Workshops

Repositório com prompts e material de estudo para uso do **Kiro IDE** — AI-powered development environment.

---

## Workshops Disponíveis

| Workshop | Descrição |
|---|---|
| [Kiro Kanban](#kiro-kanban-workshop) | SPA Angular com Kanban board seguindo Spec-Driven Development iterativo |
| [Kiro MCP ViaCEP](#kiro-mcp-viacep-workshop) | Servidor MCP para consulta de CEPs brasileiros via API ViaCEP |
| [Kiro Full Solution AWS](#kiro-full-solution-aws-workshop) | POC full-stack moderna: React + Java Spring Boot + AWS Cognito + CDK, organizada em sprints |

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

**Stack:** Node.js 20+ · TypeScript · MCP SDK · Docker

| Ferramenta | Descrição |
|---|---|
| `getAddressByCEP` | Retorna endereço completo a partir de um CEP |
| `getCEPByAddress` | Busca CEPs a partir de UF, cidade e logradouro |

---

## Kiro Full Solution AWS Workshop

POC completa e funcional servindo como **template de fast first step** para projetos modernos na AWS. Demonstra como o Kiro auxilia no planejamento e implementação de uma stack full-stack real, organizada em sprints independentes.

📁 [Kiro-Full-Solution-AWS/](./Kiro-Full-Solution-AWS/)  
📋 [Spec](./Kiro-Full-Solution-AWS/.kiro/specs/aws-full-stack-poc/README.md) · [Checklist de Ambiente](./Kiro-Full-Solution-AWS/.kiro/specs/aws-full-stack-poc/sprint-0-checklist/checklist.md) · [Prompt de Retomada](./Kiro-Full-Solution-AWS/.kiro/specs/aws-full-stack-poc/prompt.md)

**Stack:** React + Vite · Java 21 + Spring Boot 3.x · AWS Cognito · AWS CDK · App Runner · S3 + CloudFront · Docker Compose

**Arquitetura:**
- Frontend React (Vite + TypeScript, CSS Modules, Amplify v6) → **AWS S3 + CloudFront**
- Backend Java Spring Boot (arquitetura hexagonal, JWT via Cognito) → **AWS App Runner** (via ECR)
- Autenticação e autorização → **AWS Cognito** (User Pool provisionado via CDK)
- Desenvolvimento local → **Docker Compose** (backend + frontend em containers)

| Sprint | Descrição | Status |
|--------|-----------|--------|
| Sprint 0 | Checklist de ambiente local e conta AWS | ✅ spec |
| Sprint 1 | IaC: CDK — Cognito, ECR, App Runner, S3, CloudFront | ✅ spec |
| Sprint 2 | Backend Java — arquitetura hexagonal + deploy App Runner | ✅ spec |
| Sprint 3 | Frontend React — login, home protegida + deploy S3/CloudFront | ✅ spec |
| Sprint 4 | Docker Compose local + pipeline de deploy end-to-end | ✅ spec |

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
