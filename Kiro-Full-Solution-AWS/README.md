# aws-full-stack-poc — Spec Index

POC template for modern AWS full-stack projects. Organized in 5 sprints (0–4).

| Sprint | Directory | Description |
|--------|-----------|-------------|
| Sprint 0 | [sprint-0-checklist/](./sprint-0-checklist/checklist.md) | Environment setup — local tools + AWS account readiness |
| Sprint 1 | [sprint-1-iac/](./sprint-1-iac/requirements.md) | AWS CDK — Cognito, ECR, App Runner, S3, CloudFront + CodePipeline |
| Sprint 2 | [sprint-2-backend/](./sprint-2-backend/requirements.md) | Java 21 / Spring Boot 3.x — hexagonal architecture |
| Sprint 3 | [sprint-3-frontend/](./sprint-3-frontend/requirements.md) | React + Vite + TypeScript |
| Sprint 4 | [sprint-4-integration/](./sprint-4-integration/requirements.md) | CI/CD pipeline — CodePipeline + CodeBuild |

## Development Model

| Context | Backend | Frontend |
|---------|---------|----------|
| Local dev | `./gradlew bootRun` | `npm run dev` |
| Production deploy | CodeBuild: `docker build` + ECR push → App Runner | CodeBuild: `npm run build` + S3 sync → CloudFront |
| Docker required locally? | ❌ No | ❌ No |

Deploy is fully automated — push to `main` triggers CodePipeline.

## Hosting Decisions

| Component | Local | Production |
|-----------|-------|------------|
| Backend | Process on port 8080 | AWS App Runner (via ECR) |
| Frontend | Process on port 5173 | AWS S3 + CloudFront |
| Auth | AWS Cognito (real pool) | AWS Cognito (same pool) |
| Build / Deploy | Not done locally | AWS CodePipeline + CodeBuild |

## Requirements Summary

| # | Sprint | Requirement | Key Concern |
|---|--------|-------------|-------------|
| 1 | Sprint 1 | Cognito User Pool Provisioning | User Pool, App Client, password policy, self-signup |
| 2 | Sprint 1 | Backend Hosting: App Runner + ECR | ECR repo, App Runner, placeholder image, `BackendUrl` |
| 3 | Sprint 1 | Frontend Hosting: S3 + CloudFront | Private S3, OAC, SPA error pages, `FrontendUrl` |
| 4 | Sprint 1 | CI/CD Pipeline: CodePipeline + CodeBuild | CodeStar Connection, two parallel stages, `PipelineUrl` |
| 5 | Sprint 1 | CDK Project Structure and DX | `cdk synth/deploy/destroy`, assertion tests |
| 6 | Sprint 2 | Health Check Endpoint | `GET /actuator/health` → 200 |
| 7 | Sprint 2 | JWT-Protected /api/me Endpoint | Cognito JWT validation, 401 on failure |
| 8 | Sprint 2 | CORS Configuration | Allowed origins, preflight |
| 9 | Sprint 2 | Hexagonal Architecture | `domain/`, `application/`, `infrastructure/` |
| 10 | Sprint 2 | Dockerfile (pipeline only) | Multi-stage, `eclipse-temurin:21-jre-alpine`, no local Docker |
| 11 | Sprint 3 | Login Page and Cognito Auth | Amplify v6, route guard, in-memory token |
| 12 | Sprint 3 | Protected Home Page and Backend Integration | `/api/me` call, claim display |
| 13 | Sprint 3 | Styling and Developer Experience | CSS Modules only, no UI library |
| 14 | Sprint 3 | Static Bundle Build for Pipeline | `npm run build` → `dist/`, no Dockerfile, `.env.example` |
| 15 | Sprint 4 | Pipeline Backend: CodeBuild + ECR + App Runner | `gradlew build` → `docker build` → ECR → App Runner |
| 16 | Sprint 4 | Pipeline Frontend: CodeBuild + S3 + CloudFront | `npm run build` → S3 sync → CloudFront invalidation |
| 17 | Sprint 4 | Pipeline Provisioning via CDK | CodeStar, CodePipeline, buildspecs, IAM roles |
| 18 | Sprint 4 | Dockerfiles (pipeline only) | Backend only, no frontend Dockerfile |
| 19 | Sprint 4 | Configuration and Documentation | `.env.example`, root README, no-Docker-local statement |

## Sprint Dependencies

```
Sprint 0 (Checklist) → environment ready, region + Java package decided
    ↓
Sprint 1 (IaC) → provisions everything: Cognito, ECR, App Runner, S3, CloudFront, CodePipeline
    ↓
Sprint 2 (Backend) — `./gradlew bootRun` locally; pipeline handles deploy
Sprint 3 (Frontend) — `npm run dev` locally; pipeline handles deploy
    ↓
Sprint 4 (Pipeline) — CodePipeline + CodeBuild provisioned via CDK (Sprint 1)
                       push to GitHub → build → automatic deploy
```

## Architecture Notes

- **Backend** follows hexagonal architecture. `./gradlew bootRun` for local dev. Docker is used only by CodeBuild.
- **Frontend** CSS Modules, Amplify v6, no UI library. `npm run dev` for local dev. No Dockerfile — deployed directly to S3.
- **Pipeline** CodePipeline triggered by GitHub push via CodeStar Connection. Two parallel stages: backend (Docker + ECR + App Runner) and frontend (npm build + S3 + CloudFront).
- **IaC** a single `npx cdk deploy` provisions all infrastructure + pipeline.

## Feature name

`aws-full-stack-poc`

## Spec ID

`16dea097-8589-4af3-98a3-935f73f3f38c`
