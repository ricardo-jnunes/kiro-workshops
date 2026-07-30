# aws-full-stack-poc — Spec Index

POC template for modern AWS full-stack projects. Organized in 4 independent sprints.

| Sprint | Directory | Description |
|--------|-----------|-------------|
| Sprint 0 | [sprint-0-checklist/](./sprint-0-checklist/checklist.md) | Environment setup — local tools + AWS account readiness |
| Sprint 1 | [sprint-1-iac/](./sprint-1-iac/requirements.md) | AWS CDK — Cognito, ECR, App Runner, S3, CloudFront |
| Sprint 2 | [sprint-2-backend/](./sprint-2-backend/requirements.md) | Java 21 / Spring Boot 3.x — hexagonal architecture → App Runner |
| Sprint 3 | [sprint-3-frontend/](./sprint-3-frontend/requirements.md) | React + Vite + TypeScript → S3 + CloudFront |
| Sprint 4 | [sprint-4-integration/](./sprint-4-integration/requirements.md) | Docker Compose (local) + deploy pipeline documentation |

## Hosting Decisions

| Component | Local | Production |
|-----------|-------|------------|
| Backend | Docker Compose (port 8080) | AWS App Runner (via ECR) |
| Frontend | Docker Compose nginx (port 3000) | AWS S3 + CloudFront |
| Auth | AWS Cognito (real, shared) | AWS Cognito (same pool) |

## Requirements Summary

| # | Sprint | Requirement | Key Concern |
|---|--------|-------------|-------------|
| 1 | Sprint 1 | Cognito User Pool Provisioning | User Pool, App Client, password policy, self-signup |
| 2 | Sprint 1 | Backend Hosting: App Runner + ECR | ECR repo, App Runner service, IAM role, health check, `BackendUrl` output |
| 3 | Sprint 1 | Frontend Hosting: S3 + CloudFront | Private S3, OAC, SPA error pages, `FrontendUrl` + `FrontendBucketName` outputs |
| 4 | Sprint 1 | CDK Project Structure and DX | `npx cdk synth/deploy/destroy`, CDK assertion tests |
| 5 | Sprint 2 | Health Check Endpoint | `GET /actuator/health` → 200, no auth required |
| 6 | Sprint 2 | JWT-Protected /api/me Endpoint | Cognito JWT validation, 401 on failure |
| 7 | Sprint 2 | CORS Configuration | Allowed origins, preflight support |
| 8 | Sprint 2 | Hexagonal Architecture | `domain/`, `application/`, `infrastructure/` layers |
| 9 | Sprint 2 | Container Image and App Runner Deployment | Multi-stage Dockerfile, ECR push, `deploy.sh` |
| 10 | Sprint 3 | Login Page and Cognito Auth | Amplify v6, route guard, in-memory token, error handling |
| 11 | Sprint 3 | Protected Home Page and Backend Integration | `/api/me` call, JWT Bearer, claim display |
| 12 | Sprint 3 | Styling and Developer Experience | CSS Modules only, no UI library |
| 13 | Sprint 3 | Static Bundle Deployment to S3 + CloudFront | `aws s3 sync`, CloudFront invalidation, `deploy.sh` |
| 14 | Sprint 4 | Docker Compose Orchestration | Single `docker compose up --build`, health check gate |
| 15 | Sprint 4 | Dockerfiles (Multi-Stage Builds) | `eclipse-temurin:21`, `node:20-alpine` + `nginx:alpine` |
| 16 | Sprint 4 | Configuration and Documentation | `.env.example`, root README, full AWS deploy sequence |

## Sprint Dependencies

```
Sprint 0 (Checklist) → environment ready, region + package name decided
    ↓
Sprint 1 (IaC) → outputs: UserPoolId, UserPoolClientId, CognitoDomain, BackendUrl, FrontendUrl, FrontendBucketName
    ↓
Sprint 2 (Backend) — needs COGNITO_ISSUER_URI, CORS_ALLOWED_ORIGINS (= FrontendUrl)
Sprint 3 (Frontend) — needs VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_CLIENT_ID, VITE_API_BASE_URL (= BackendUrl)
    ↓
Sprint 4 (Integration) — local Docker Compose + full AWS deploy sequence documentation
```

## Architecture Notes

- **Backend** follows hexagonal architecture: `domain/` is framework-free, `application/` holds use cases, `infrastructure/` holds Spring adapters. Deployed as a container to App Runner.
- **Frontend** uses AWS Amplify v6 directly (no Hosted UI) with in-memory token storage. Deployed as a static bundle to S3 + CloudFront.
- **IaC** provisions all AWS resources in one CDK stack: Cognito, ECR, App Runner, S3, CloudFront. All resources are tagged and destroyable with a single command.

## Feature name

`aws-full-stack-poc`

## Spec ID

`16dea097-8589-4af3-98a3-935f73f3f38c`
