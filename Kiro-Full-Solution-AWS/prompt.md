# Example Prompt — aws-full-stack-poc

> This file contains a ready-to-use prompt. Paste it into a new Kiro session to recreate the entire project from scratch.

---

## Prompt

I want to create a complete POC that serves as a starting-point template for modern AWS projects. The project should be organized in independent sprints, where each sprint can be developed, tested, and delivered separately.

**Project directory:** `Kiro-Full-Solution-AWS/`

---

### Stack and requirements per sprint

**Sprint 1 — IaC with AWS CDK (folder `infra/`)**

- Use AWS CDK with TypeScript
- Provision a Cognito User Pool with email sign-in, self-registration enabled, and password policy: minimum 8 characters, uppercase, lowercase, and digit
- Create a User Pool App Client without client secret, with flows `ALLOW_USER_SRP_AUTH` and `ALLOW_REFRESH_TOKEN_AUTH`
- Provision a private ECR repository named `aws-full-stack-poc-backend` to store the backend image
- Provision an AWS App Runner service pointing to the ECR repository, with:
  - Health check configured for `GET /actuator/health`
  - Environment variables `COGNITO_ISSUER_URI` and `CORS_ALLOWED_ORIGINS` injected into the container
  - Auto-scaling: minimum 1 instance, maximum 3
  - IAM role with permission to pull images from ECR
- Provision a private S3 bucket (public access blocked) to host the frontend static bundle
- Provision a CloudFront distribution with:
  - Origin Access Control (OAC) pointing to the S3 bucket
  - Default root object: `index.html`
  - Error pages 403 and 404 redirecting to `index.html` with HTTP 200 (to support React Router)
- Export as stack outputs: `UserPoolId`, `UserPoolClientId`, `CognitoDomain`, `BackendUrl`, `FrontendUrl`, `FrontendBucketName`
- Tag all resources with `Project: aws-full-stack-poc` and `Environment: dev`
- Include tests with CDK Assertions and a `README.md` inside `infra/` with bootstrap and deploy steps

**Sprint 2 — Java Backend (folder `backend/`)**

- Java 21 + Spring Boot 3.x + Gradle with Kotlin DSL
- Mandatory hexagonal architecture (ports and adapters) structure:
  - `com.example.poc.domain` — models and port interfaces; no framework imports
  - `com.example.poc.application` — use cases depending only on port interfaces
  - `com.example.poc.infrastructure` — Spring adapters: REST controllers, security config, Cognito adapter
- The `GET /api/me` endpoint implemented with: `GetCurrentUserUseCase` (application), `UserIdentityPort` (domain/ports), `CognitoUserIdentityAdapter` (infrastructure), `MeController` (infrastructure/web)
- Endpoints: `GET /actuator/health` (public) and `GET /api/me` (protected, returns `sub` and `email`)
- HTTP 401 for requests without token, with expired token, or invalid token
- Automatic JWT validation via JWKS with `spring-security-oauth2-resource-server`
- CORS configurable via `CORS_ALLOWED_ORIGINS` (default: `http://localhost:5173`)
- Required environment variable: `COGNITO_ISSUER_URI`
- Multi-stage Dockerfile: `eclipse-temurin:21-jdk-alpine` (build) → `eclipse-temurin:21-jre-alpine` (runtime)
- `deploy.sh` script for build, tag, push the image to ECR, and trigger App Runner redeployment
- The service should become healthy within 5 minutes after deploy

**Sprint 3 — React Frontend (folder `frontend/`)**

- Vite + React + TypeScript
- AWS Amplify v6 for Cognito authentication — no Hosted UI, direct SDK usage
- Cognito token stored in memory only (never in `localStorage` or `sessionStorage`)
- Styling exclusively via CSS Modules — zero UI library dependencies
- Routes: `/login` (login page) and `/` (protected home page with route guard)
- Home page calls `GET /api/me` with JWT as Bearer token and displays `sub` and `email`
- Environment variables: `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN`, `VITE_API_BASE_URL` (= App Runner `BackendUrl`)
- Dev server on port 5173
- Multi-stage Dockerfile: `node:20-alpine` (build) → `nginx:alpine` (runtime, for local Docker Compose usage)
- `deploy.sh` script for bundle build, S3 sync, and CloudFront invalidation

**Sprint 4 — Docker Compose and Integration (project root)**

- `docker-compose.yml` at the root that starts backend (port 8080) and frontend (port 3000) with `docker compose up --build`
- Frontend waits for the backend to pass the health check before starting
- Nginx in the frontend container proxies `/api/*` to the backend via the Docker internal network
- Configuration via `.env` file at the root
- `.env.example` documenting all variables with comments
- `README.md` at the root with: prerequisites (Node.js 20+, Java 21, Docker 24+, Docker Compose v2, AWS CLI v2, AWS CDK v2), "Quick Start" section to run locally, "AWS Deployment" section with the complete sequence:
  1. `npx cdk bootstrap && npx cdk deploy` (Sprint 1)
  2. `./deploy.sh` in the backend to push to ECR and trigger App Runner redeployment (Sprint 2)
  3. `./deploy.sh` in the frontend to sync to S3 and invalidate CloudFront (Sprint 3)

---

### General requirements

- Each sprint must be executable and testable in isolation
- Each sprint must have its own spec directory with `requirements.md` and a "Running in Isolation" section
- Dependency flow: Sprint 1 generates outputs → Sprint 2 and 3 consume them → Sprint 4 integrates everything
