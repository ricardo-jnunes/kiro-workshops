# aws-full-stack-poc — Spec Index

POC template for modern AWS full-stack projects. Organized in 4 independent sprints.

| Sprint | Directory | Description |
|--------|-----------|-------------|
| Sprint 1 | [sprint-1-iac/](./sprint-1-iac/requirements.md) | AWS CDK — Cognito User Pool provisioning |
| Sprint 2 | [sprint-2-backend/](./sprint-2-backend/requirements.md) | Java 21 / Spring Boot 3.x backend — hexagonal architecture |
| Sprint 3 | [sprint-3-frontend/](./sprint-3-frontend/requirements.md) | React + Vite + TypeScript frontend |
| Sprint 4 | [sprint-4-integration/](./sprint-4-integration/requirements.md) | Docker Compose + Dockerfiles + documentation |

## Requirements Summary

| # | Sprint | Requirement | Key Concern |
|---|--------|-------------|-------------|
| 1 | Sprint 1 | Cognito User Pool Provisioning | CDK stack, User Pool, App Client, outputs |
| 2 | Sprint 1 | CDK Project Structure and DX | `npx cdk synth/deploy/destroy`, assertion tests |
| 3 | Sprint 2 | Health Check Endpoint | `GET /actuator/health` → 200 |
| 4 | Sprint 2 | JWT-Protected /api/me Endpoint | Cognito JWT validation, 401 on failure |
| 5 | Sprint 2 | CORS Configuration | Allowed origins, preflight support |
| 6 | Sprint 2 | Hexagonal Architecture | `domain/`, `application/`, `infrastructure/` layers |
| 7 | Sprint 3 | Login Page and Cognito Auth | Amplify v6, route guard, error handling |
| 8 | Sprint 3 | Protected Home Page and Backend Integration | `/api/me` call, JWT Bearer, claim display |
| 9 | Sprint 3 | Styling and Developer Experience | CSS Modules only, no UI library |
| 10 | Sprint 4 | Docker Compose Orchestration | Single `docker compose up --build`, health check gate |
| 11 | Sprint 4 | Dockerfiles (Multi-Stage Builds) | `eclipse-temurin:21`, `node:20-alpine` + `nginx:alpine` |
| 12 | Sprint 4 | Configuration and Documentation | `.env.example`, root README, quick-start guide |

## Sprint Dependencies

```
Sprint 1 (IaC) → outputs Cognito config
    ↓
Sprint 2 (Backend) — needs COGNITO_ISSUER_URI
Sprint 3 (Frontend) — needs VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_CLIENT_ID
    ↓
Sprint 4 (Integration) — wires everything together via Docker Compose
```

## Architecture Notes

- **Backend** follows hexagonal architecture (ports and adapters): `domain/` is framework-free, `application/` holds use cases, `infrastructure/` holds Spring adapters and controllers.
- **Frontend** uses AWS Amplify v6 directly (no Hosted UI) with in-memory token storage.
- **IaC** uses AWS CDK TypeScript; all resources are tagged and destroyable with a single command.

## Feature name

`aws-full-stack-poc`

## Spec ID

`16dea097-8589-4af3-98a3-935f73f3f38c`
