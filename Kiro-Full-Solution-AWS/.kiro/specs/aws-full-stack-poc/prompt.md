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
- Provisionar um Cognito User Pool com sign-in por email, self-registration habilitado e password policy: mínimo 8 caracteres, maiúscula, minúscula e dígito
- Criar um User Pool App Client sem client secret, com flows `ALLOW_USER_SRP_AUTH` e `ALLOW_REFRESH_TOKEN_AUTH`
- Provisionar um repositório ECR privado chamado `aws-full-stack-poc-backend` para armazenar a imagem do backend
- Provisionar um serviço AWS App Runner apontando para o repositório ECR, com:
  - Health check configurado para `GET /actuator/health`
  - Variáveis de ambiente `COGNITO_ISSUER_URI` e `CORS_ALLOWED_ORIGINS` injetadas no container
  - Auto-scaling: mínimo 1 instância, máximo 3
  - IAM role com permissão para pull de imagens do ECR
- Provisionar um bucket S3 privado (acesso público bloqueado) para hospedar o bundle estático do frontend
- Provisionar uma distribuição CloudFront com:
  - Origin Access Control (OAC) apontando para o bucket S3
  - Objeto raiz padrão: `index.html`
  - Páginas de erro 403 e 404 redirecionando para `index.html` com HTTP 200 (para suporte ao React Router)
- Exportar como stack outputs: `UserPoolId`, `UserPoolClientId`, `CognitoDomain`, `BackendUrl`, `FrontendUrl`, `FrontendBucketName`
- Taguear todos os recursos com `Project: aws-full-stack-poc` e `Environment: dev`
- Incluir testes com CDK Assertions e `README.md` dentro de `infra/` com passos de bootstrap e deploy

**Sprint 2 — Backend Java (pasta `backend/`)**

- Java 21 + Spring Boot 3.x + Gradle com Kotlin DSL
- Estrutura obrigatória em arquitetura hexagonal (ports and adapters):
  - `com.example.poc.domain` — modelos e interfaces de porta; sem nenhum import de framework
  - `com.example.poc.application` — use cases dependendo apenas das interfaces de porta
  - `com.example.poc.infrastructure` — adapters Spring: controllers REST, security config, adapter Cognito
- O endpoint `GET /api/me` implementado com: `GetCurrentUserUseCase` (application), `UserIdentityPort` (domain/ports), `CognitoUserIdentityAdapter` (infrastructure), `MeController` (infrastructure/web)
- Endpoints: `GET /actuator/health` (público) e `GET /api/me` (protegido, retorna `sub` e `email`)
- HTTP 401 para requisições sem token, com token expirado ou inválido
- Validação JWT automática via JWKS com `spring-security-oauth2-resource-server`
- CORS configurável via `CORS_ALLOWED_ORIGINS` (default: `http://localhost:5173`)
- Variável de ambiente necessária: `COGNITO_ISSUER_URI`
- Dockerfile multi-stage: `eclipse-temurin:21-jdk-alpine` (build) → `eclipse-temurin:21-jre-alpine` (runtime)
- Script `deploy.sh` para build, tag, push da imagem para o ECR e trigger de redeployment no App Runner
- O serviço deve se tornar healthy em até 5 minutos após o deploy

**Sprint 3 — Frontend React (pasta `frontend/`)**

- Vite + React + TypeScript
- AWS Amplify v6 para autenticação com Cognito — sem Hosted UI, direto via SDK
- Token Cognito armazenado apenas em memória (nunca em `localStorage` ou `sessionStorage`)
- Estilização exclusivamente via CSS Modules — zero dependências de bibliotecas de UI
- Rotas: `/login` (login page) e `/` (home page protegida com route guard)
- Home page chama `GET /api/me` com o JWT como Bearer token e exibe `sub` e `email`
- Variáveis de ambiente: `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN`, `VITE_API_BASE_URL` (= App Runner `BackendUrl`)
- Dev server na porta 5173
- Dockerfile multi-stage: `node:20-alpine` (build) → `nginx:alpine` (runtime, para uso no Docker Compose local)
- Script `deploy.sh` para build do bundle, sync para o S3 e invalidação do CloudFront

**Sprint 4 — Docker Compose e integração (raiz do projeto)**

- `docker-compose.yml` na raiz que sobe backend (porta 8080) e frontend (porta 3000) com `docker compose up --build`
- Frontend aguarda o backend passar no health check antes de iniciar
- Nginx no container do frontend faz proxy de `/api/*` para o backend via rede interna Docker
- Configuração via arquivo `.env` na raiz
- `.env.example` documentando todas as variáveis com comentários
- `README.md` na raiz com: pré-requisitos (Node.js 20+, Java 21, Docker 24+, Docker Compose v2, AWS CLI v2, AWS CDK v2), seção "Quick Start" para rodar localmente, seção "AWS Deployment" com a sequência completa:
  1. `npx cdk bootstrap && npx cdk deploy` (Sprint 1)
  2. `./deploy.sh` no backend para push para ECR e redeployment no App Runner (Sprint 2)
  3. `./deploy.sh` no frontend para sync no S3 e invalidação do CloudFront (Sprint 3)

---

### Requisitos gerais

- Cada sprint deve ser executável e testável de forma isolada
- Cada sprint deve ter seu próprio diretório de spec com `requirements.md` e uma seção "Rodando em Isolamento"
- Fluxo de dependência: Sprint 1 gera os outputs → Sprint 2 e 3 consomem → Sprint 4 integra tudo
