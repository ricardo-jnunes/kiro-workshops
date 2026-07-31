# Requirements Document

## Introduction

Provision all AWS resources required by the POC using AWS CDK with TypeScript. This sprint provisions the full infrastructure **including the CI/CD pipeline** — so after `cdk deploy`, every subsequent code change is deployed automatically by pushing to GitHub.

**Hosting:**
- Backend → AWS App Runner (container from ECR, built by CodeBuild)
- Frontend → AWS S3 + CloudFront (static bundle, built and synced by CodeBuild)

**CI/CD:**
- Source: GitHub (via CodeStar Connection)
- Pipeline: AWS CodePipeline + CodeBuild
- Trigger: push to `main` branch

## Glossary

- **System**: The AWS CDK infrastructure stack that provisions and manages all cloud resources for the aws-full-stack-poc project.
- **CDK Stack**: An AWS Cloud Development Kit deployment unit containing all CloudFormation resources defined in TypeScript.
- **App Runner**: AWS App Runner, a fully managed container service used to host the Spring Boot backend.
- **ECR**: Amazon Elastic Container Registry, a private Docker image registry.
- **CloudFront**: Amazon CloudFront, a content delivery network used to serve the frontend static bundle.
- **CodePipeline**: AWS CodePipeline, an automated CI/CD orchestration service.
- **CodeBuild**: AWS CodeBuild, a managed build service used for compiling, testing, and deploying artifacts.
- **CodeStar Connection**: AWS CodeStar Connections, a service for linking external source providers (GitHub) to AWS services.
- **Cognito User Pool**: Amazon Cognito User Pool, a managed identity provider for user authentication.
- **OAC**: Origin Access Control, a CloudFront mechanism for securely accessing private S3 origins.

## Requirements

### Requirement 1: Cognito User Pool Provisioning

**User Story:** As a developer, I want to provision an AWS Cognito User Pool via IaC, so that I can have a repeatable and version-controlled authentication infrastructure.

#### Acceptance Criteria

1. WHEN the CDK stack is synthesized, THE System SHALL produce a CloudFormation template that includes a Cognito User Pool with email as the primary sign-in attribute.
2. WHEN the CDK stack is deployed, THE System SHALL create a Cognito User Pool Client named `aws-full-stack-poc-client` with `ALLOW_USER_SRP_AUTH` and `ALLOW_REFRESH_TOKEN_AUTH` auth flows enabled and no client secret.
3. WHEN the CDK stack is deployed, THE System SHALL output the User Pool ID, User Pool Client ID, and Cognito hosted domain as CloudFormation stack outputs.
4. WHEN the CDK stack is deployed, THE System SHALL enforce a password policy requiring minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit.
5. WHEN the CDK stack is deployed, THE System SHALL enable self-registration (sign-up) so new users can create accounts without administrator intervention.
6. WHEN the CDK stack is deployed, THE System SHALL tag all resources with `Project: aws-full-stack-poc` and `Environment: dev`.

### Requirement 2: Backend Hosting — AWS App Runner + ECR

**User Story:** As a developer, I want the backend container hosted on AWS App Runner with an ECR registry, so that I can deploy the Spring Boot service without managing clusters, load balancers, or VPCs.

#### Acceptance Criteria

1. WHEN the CDK stack is deployed, THE System SHALL create an ECR private repository named `aws-full-stack-poc-backend`.
2. WHEN the CDK stack is deployed, THE System SHALL create an AWS App Runner service pointing to the ECR repository, using a placeholder public image (`public.ecr.aws/amazonlinux/amazonlinux:latest`) until the first pipeline run replaces it.
3. WHEN the App Runner service starts, THE System SHALL pass `COGNITO_ISSUER_URI` and `CORS_ALLOWED_ORIGINS` as environment variables to the container.
4. WHEN the CDK stack is deployed, THE System SHALL configure the App Runner health check to call `GET /actuator/health` and expect HTTP 200.
5. WHEN the CDK stack is deployed, THE System SHALL create an IAM role granting the App Runner service permission to pull images from the ECR repository.
6. WHEN the CDK stack is deployed, THE System SHALL output the App Runner service URL as a CloudFormation stack output (`BackendUrl`).
7. WHEN the CDK stack is deployed, THE System SHALL configure the App Runner service with auto-scaling: minimum 1 instance, maximum 3 instances.

### Requirement 3: Frontend Hosting — S3 + CloudFront

**User Story:** As a developer, I want the React frontend hosted on S3 with CloudFront as CDN, so that I can serve the static bundle globally with HTTPS and low latency.

#### Acceptance Criteria

1. WHEN the CDK stack is deployed, THE System SHALL create a private S3 bucket for hosting the frontend static bundle with public access blocked.
2. WHEN the CDK stack is deployed, THE System SHALL create a CloudFront distribution with the S3 bucket as origin, using Origin Access Control (OAC).
3. WHEN the CDK stack is deployed, THE System SHALL configure the CloudFront distribution with a default root object of `index.html`.
4. WHEN a CloudFront request returns 403 or 404, THE System SHALL return `index.html` with HTTP 200 to support client-side React Router navigation.
5. WHEN the CDK stack is deployed, THE System SHALL output the CloudFront domain name as `FrontendUrl` and the S3 bucket name as `FrontendBucketName`.

### Requirement 4: CI/CD Pipeline — CodePipeline + CodeBuild

**User Story:** As a developer, I want a fully automated pipeline that builds and deploys both services on every push to main, so that I never need to run Docker or any deploy command locally.

#### Acceptance Criteria

1. WHEN the CDK stack is deployed, THE System SHALL create a CodeStar Connection to GitHub as the pipeline source.
2. WHEN the CDK stack is deployed, THE System SHALL create a CodePipeline triggered by pushes to the `main` branch with two parallel build stages: `BuildBackend` and `BuildFrontend`.
3. WHEN the `BuildBackend` stage runs, THE System SHALL: run `./gradlew build -x test`, build the Docker image using `backend/Dockerfile`, push it to ECR, and trigger an App Runner redeployment.
4. WHEN the `BuildFrontend` stage runs, THE System SHALL: run `npm ci && npm run build` with `VITE_*` environment variables injected, sync `dist/` to S3, and create a CloudFront cache invalidation for `/*`.
5. WHEN the CDK stack is deployed, THE System SHALL create CodeBuild projects with appropriate IAM roles: ECR push permissions for backend, S3 + CloudFront permissions for frontend.
6. WHEN the CDK stack is deployed, THE System SHALL output the CodePipeline console URL as `PipelineUrl`.
7. THE System SHALL configure the `BuildBackend` CodeBuild environment with `privilegedMode: true` to allow Docker daemon access.

### Requirement 5: CDK Project Structure and Developer Experience

**User Story:** As a developer, I want a well-structured CDK project in `infra/`, so that I can provision all infrastructure and the pipeline with a single command.

#### Acceptance Criteria

1. WHEN a developer runs `npx cdk synth`, THE System SHALL synthesize without errors.
2. WHEN a developer runs `npx cdk deploy`, THE System SHALL provision all resources idempotently.
3. WHEN a developer runs `npx cdk destroy`, THE System SHALL remove all provisioned resources.
4. THE System SHALL provide an `infra/README.md` that documents prerequisites, bootstrap steps, and the one-time manual step to activate the CodeStar Connection in the AWS console after deploy.
5. WHEN `npm test` runs, THE System SHALL execute CDK assertion tests that validate the CloudFormation template contains the expected resources and outputs.

---

## Running Sprint 1

```bash
cd infra
npm install
npx cdk bootstrap aws://<ACCOUNT_ID>/<REGION>  # once per account/region
npx cdk synth    # validate
npx cdk deploy   # provision everything

# After deploy: activate the CodeStar Connection in AWS console
# Console → Developer Tools → Connections → select connection → "Update pending connection"
```

**Stack outputs after deploy:**

| Output | Used by |
|--------|---------|
| `UserPoolId` | Sprint 2 env var, Sprint 3 env var |
| `UserPoolClientId` | Sprint 3 env var |
| `CognitoDomain` | Sprint 3 env var |
| `BackendUrl` | Sprint 3 `VITE_API_BASE_URL`, pipeline CodeBuild env var |
| `FrontendUrl` | Sprint 2 `CORS_ALLOWED_ORIGINS` |
| `FrontendBucketName` | pipeline CodeBuild (S3 sync target) |
| `PipelineUrl` | direct link to monitor deployments |
