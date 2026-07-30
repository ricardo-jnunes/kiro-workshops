# Prompt de Exemplo — aws-full-stack-poc

> Este arquivo contém um prompt pronto para uso. Cole-o em uma nova sessão do Kiro para recriar todo o projeto do zero.

---

## Prompt

Quero criar uma POC completa que sirva como template de ponto de partida para projetos modernos na AWS. O projeto deve ser organizado em sprints independentes, onde cada sprint pode ser desenvolvido, testado e entregue separadamente.

**Diretório do projeto:** `Kiro-Full-Solution-AWS/`

---

### Stack e requisitos por sprint

**Sprint 1 — IaC com AWS CDK (pasta `infra/`)**

- Usar AWS CDK com TypeScript
- Provisionar um Cognito User Pool com:
  - Sign-in por email
  - Self-registration habilitado (sem aprovação de admin)
  - Password policy: mínimo 8 caracteres, pelo menos uma maiúscula, uma minúscula e um dígito
- Criar um User Pool App Client sem client secret, com auth flows `ALLOW_USER_SRP_AUTH` e `ALLOW_REFRESH_TOKEN_AUTH`
- Exportar como stack outputs: `UserPoolId`, `UserPoolClientId` e `CognitoDomain`
- Taguear todos os recursos com `Project: aws-full-stack-poc` e `Environment: dev`
- O stack deve ser destruível com `npx cdk destroy` sem intervenção manual
- Incluir testes com CDK Assertions e um `README.md` dentro de `infra/` com os passos de bootstrap e deploy

**Sprint 2 — Backend Java (pasta `backend/`)**

- Java 21 + Spring Boot 3.x + Gradle com Kotlin DSL
- Estrutura obrigatória em arquitetura hexagonal (ports and adapters):
  - `com.example.poc.domain` — modelos de domínio e interfaces de porta; sem nenhum import de framework (Spring, Jakarta, etc.)
  - `com.example.poc.application` — use cases que dependem apenas das interfaces de porta
  - `com.example.poc.infrastructure` — adapters Spring: controllers REST, configuração de segurança, adapter Cognito
- O endpoint `GET /api/me` deve ser implementado com:
  - `GetCurrentUserUseCase` em `application/`
  - Interface `UserIdentityPort` em `domain/ports/`
  - `CognitoUserIdentityAdapter` implementando a porta em `infrastructure/`
  - `MeController` delegando ao use case em `infrastructure/web/`
- Endpoints:
  - `GET /actuator/health` — público, retorna `{"status":"UP"}`
  - `GET /api/me` — protegido, retorna `sub` e `email` do JWT Cognito
- Retornar HTTP 401 para requisições sem token, com token expirado ou com token inválido
- Validação JWT automática via JWKS usando `spring-security-oauth2-resource-server`
- CORS configurável via variável `CORS_ALLOWED_ORIGINS` (default: `http://localhost:5173`)
- Variável de ambiente necessária: `COGNITO_ISSUER_URI`

**Sprint 3 — Frontend React (pasta `frontend/`)**

- Vite + React + TypeScript
- AWS Amplify v6 para autenticação com Cognito — sem Hosted UI, direto via SDK
- Token Cognito armazenado apenas em memória (nunca em `localStorage` ou `sessionStorage`)
- Estilização exclusivamente via CSS Modules (`.module.css`) — zero dependências de bibliotecas de UI (sem MUI, Ant Design, Chakra, Bootstrap, etc.)
- Rotas:
  - `/login` — página de login com campos email e senha; exibe erro abaixo do botão sem limpar o campo email em caso de falha
  - `/` — home page protegida com o email do usuário autenticado e botão de logout
- Route guard: redirecionar usuário não autenticado para `/login` ao tentar acessar qualquer rota protegida
- Home page deve chamar `GET /api/me` com o JWT como Bearer token e exibir `sub` e `email`
- Variáveis de ambiente: `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_API_BASE_URL`
- Dev server na porta 5173

**Sprint 4 — Docker Compose e integração (raiz do projeto)**

- `docker-compose.yml` na raiz que sobe toda a stack com `docker compose up --build`
- Serviço `backend` na porta 8080, serviço `frontend` na porta 3000
- O serviço `frontend` só deve iniciar após o `backend` passar no health check em `GET /actuator/health`
- O container do frontend deve usar nginx e fazer proxy de `/api/*` para o backend via rede interna Docker (sem passar pelo host)
- Toda a configuração de Cognito deve vir de um arquivo `.env` na raiz do projeto (não commitado)
- Incluir `.env.example` com todos os nomes de variáveis, valores placeholder e comentários explicativos
- Dockerfiles multi-stage:
  - Backend: stage de build com `eclipse-temurin:21-jdk-alpine`, stage de runtime com `eclipse-temurin:21-jre-alpine`
  - Frontend: stage de build com `node:20-alpine`, stage de runtime com `nginx:alpine`
- `README.md` na raiz com:
  - Seção "Pré-requisitos" com versões mínimas: Node.js 20+, Java 21, Docker 24+, Docker Compose v2, AWS CLI v2, AWS CDK v2
  - Seção "Quick Start" com passos numerados para clonar, configurar `.env` e rodar `docker compose up --build`
  - Seção "AWS Deployment" com passos para `npx cdk bootstrap`, `npx cdk deploy` e como copiar os outputs para o `.env`

---

### Requisitos gerais

- Cada sprint deve ser executável e testável de forma isolada, sem depender dos outros sprints estarem rodando
- Cada sprint deve ter seu próprio diretório de spec com `requirements.md` contendo apenas os requisitos daquele sprint e uma seção "Rodando em Isolamento" com os comandos exatos
- O fluxo de dependência entre sprints é: Sprint 1 gera os outputs do Cognito → Sprint 2 e Sprint 3 consomem esses outputs → Sprint 4 integra tudo
