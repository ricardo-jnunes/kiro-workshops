# Requirements — Sprint 4: CI/CD Pipeline (CodePipeline + CodeBuild)

## Overview

Provisionamento do pipeline de deploy contínuo via AWS CDK. Todo o processo de build de imagem Docker, push para ECR, deploy no App Runner, build do frontend, sync para S3 e invalidação do CloudFront acontece **exclusivamente na AWS** — acionado por push no GitHub via CodeStar Connection. Nenhuma etapa de build ou deploy é executada localmente.

**Fluxo completo:**
```
Push no GitHub (branch: main)
    ↓
CodePipeline (fonte: CodeStar Connection → GitHub)
    ├── Stage: BuildBackend (CodeBuild)
    │     ├── ./gradlew build -x test
    │     ├── docker build -t <ecr-uri>:$CODEBUILD_RESOLVED_SOURCE_VERSION .
    │     ├── docker push <ecr-uri>
    │     └── aws apprunner start-deployment (se imagem já existia)
    └── Stage: BuildFrontend (CodeBuild)
          ├── npm ci
          ├── npm run build (com VITE_* env vars injetadas pelo CodeBuild)
          ├── aws s3 sync dist/ s3://<bucket> --delete
          └── aws cloudfront create-invalidation --paths "/*"
```

**Desenvolvimento local (sem Docker):**
- Backend: `./gradlew bootRun`
- Frontend: `npm run dev`

---

## Requirement 10 — Pipeline Backend: CodeBuild + ECR + App Runner

**User Story:** As a developer, I want a CodeBuild project that builds the backend Docker image and deploys it to App Runner on every push to main, so that I never need Docker installed locally.

#### Acceptance Criteria

1. WHEN a push is made to the `main` branch THEN the CodePipeline SHALL trigger automatically via the CodeStar Connection to GitHub.
2. WHEN the backend CodeBuild stage runs THEN the system SHALL run `./gradlew build -x test` to produce the fat JAR.
3. WHEN the backend CodeBuild stage runs THEN the system SHALL build the Docker image using the `backend/Dockerfile` and push it to the ECR repository provisioned in Sprint 1.
4. WHEN the Docker image is pushed to ECR THEN the system SHALL trigger an App Runner redeployment so the new version is served.
5. WHEN the CodeBuild project runs THEN the system SHALL use an environment with Docker daemon available (e.g., `BUILD_GENERAL1_SMALL` with `privilegedMode: true`).
6. WHEN the CodeBuild project authenticates to ECR THEN the system SHALL use an IAM role with `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, and `ecr:PutImage` permissions.

---

## Requirement 11 — Pipeline Frontend: CodeBuild + S3 + CloudFront

**User Story:** As a developer, I want a CodeBuild project that builds the React bundle and deploys it to S3 + CloudFront on every push to main, so that the frontend is updated automatically without any local build step.

#### Acceptance Criteria

1. WHEN the frontend CodeBuild stage runs THEN the system SHALL run `npm ci` followed by `npm run build`.
2. WHEN the frontend CodeBuild stage runs THEN the system SHALL inject `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN`, and `VITE_API_BASE_URL` as environment variables from AWS Systems Manager Parameter Store or CodeBuild environment variables.
3. WHEN `npm run build` completes THEN the system SHALL sync the `dist/` directory to the S3 bucket using `aws s3 sync dist/ s3://<FrontendBucketName> --delete`.
4. WHEN the S3 sync completes THEN the system SHALL create a CloudFront cache invalidation for `/*` so updated assets are served immediately.
5. WHEN the CodeBuild project runs THEN the system SHALL use an IAM role with `s3:PutObject`, `s3:DeleteObject`, `cloudfront:CreateInvalidation` permissions.

---

## Requirement 12 — Provisionamento do Pipeline via CDK

**User Story:** As a developer, I want the entire CI/CD pipeline provisioned as code in the CDK stack, so that the pipeline itself is reproducible and version-controlled.

#### Acceptance Criteria

1. WHEN the CDK stack is deployed THEN the system SHALL create a CodeStar Connection to GitHub (requires one-time manual activation in the AWS console after deploy).
2. WHEN the CDK stack is deployed THEN the system SHALL create a CodePipeline with two parallel build stages: `BuildBackend` and `BuildFrontend`.
3. WHEN the CDK stack is deployed THEN the system SHALL create a `buildspec.yml` (inline or as file) for the backend CodeBuild project defining the build, image tag, ECR push, and App Runner deployment commands.
4. WHEN the CDK stack is deployed THEN the system SHALL create a `buildspec.yml` for the frontend CodeBuild project defining `npm ci`, `npm run build`, S3 sync, and CloudFront invalidation commands.
5. WHEN the CDK stack is deployed THEN the system SHALL output the CodePipeline URL as a CloudFormation stack output (`PipelineUrl`) for easy access.
6. WHEN the CDK stack is deployed THEN the system SHALL create all necessary IAM roles with least-privilege permissions for CodeBuild and CodePipeline.

---

## Requirement 13 — Dockerfiles (somente para uso no pipeline)

**User Story:** As a developer, I want Dockerfiles for both services that are used exclusively by the CodeBuild pipeline, so that I never need Docker installed locally.

#### Acceptance Criteria

1. THE `backend/Dockerfile` SHALL use a multi-stage build: `eclipse-temurin:21-jdk-alpine` para o stage de build e `eclipse-temurin:21-jre-alpine` para o runtime.
2. THE `backend/Dockerfile` SHALL expect the fat JAR to already exist in `build/libs/` (built by `./gradlew build` in a prior CodeBuild step).
3. THE `frontend/` directory SHALL NOT require a Dockerfile — o frontend é deploiado como bundle estático diretamente para S3, sem containerização.
4. WHEN `backend/Dockerfile` is present in the repository THEN it SHALL be executable by the CodeBuild pipeline without any local pre-requisites.

---

## Requirement 14 — Configuração e Documentação

**User Story:** As a developer, I want a `.env.example` and root-level README that document the no-Docker-local development workflow clearly.

#### Acceptance Criteria

1. WHEN the project is cloned THEN the system SHALL include a `.env.example` at the root listing all environment variable keys with placeholder values and comments.
2. WHEN the project root `README.md` is read THEN the system SHALL include a "Desenvolvimento Local" section as the primary workflow — sem Docker:
   - Terminal 1: `cd backend && ./gradlew bootRun`
   - Terminal 2: `cd frontend && npm run dev`
3. WHEN the project root `README.md` is read THEN the system SHALL include a "Deploy" section describing that deploy happens automatically on push to `main` via CodePipeline — sem nenhum comando manual.
4. WHEN the project root `README.md` is read THEN the system SHALL list Docker as a **non-requirement** for local development, clearly stating it is used only by the CodeBuild pipeline in AWS.
5. WHEN the project root `README.md` is read THEN the system SHALL document the one-time manual step required after `cdk deploy`: activating the CodeStar Connection in the AWS console.

---

## Desenvolvimento Local (Sem Docker)

```bash
# Requer: Sprint 1 executado e outputs do CDK disponíveis

# Terminal 1 — Backend
cd backend
export COGNITO_ISSUER_URI=https://cognito-idp.<region>.amazonaws.com/<UserPoolId>
export CORS_ALLOWED_ORIGINS=http://localhost:5173
./gradlew bootRun
# Disponível em: http://localhost:8080

# Terminal 2 — Frontend
cd frontend
# Criar .env.local:
# VITE_COGNITO_USER_POOL_ID=<UserPoolId>
# VITE_COGNITO_CLIENT_ID=<UserPoolClientId>
# VITE_COGNITO_DOMAIN=<CognitoDomain>
# VITE_API_BASE_URL=http://localhost:8080
npm run dev
# Disponível em: http://localhost:5173
```

## Deploy (automático via push no GitHub)

```bash
git add .
git commit -m "feat: minha mudança"
git push origin main
# CodePipeline é acionado automaticamente
# Acompanhar em: https://console.aws.amazon.com/codesuite/codepipeline
```

## Setup Inicial da Infraestrutura

```bash
# 1. Provisionar toda a infraestrutura + pipeline (Sprint 1)
cd infra && npx cdk bootstrap && npx cdk deploy

# 2. Ativar a CodeStar Connection no console AWS (passo manual único)
# Console → Developer Tools → Connections → selecionar a conexão → "Update pending connection"

# 3. Fazer o primeiro push para acionar o pipeline
git push origin main
```
