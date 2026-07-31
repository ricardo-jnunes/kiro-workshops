# Requirements Document

## Introduction

Continuous deployment pipeline provisioning via AWS CDK for Sprint 4. The entire process — Docker image build, ECR push, App Runner deploy, frontend build, S3 sync, and CloudFront invalidation — happens **exclusively in AWS**, triggered by a GitHub push via CodeStar Connection. No build or deploy step is ever run locally.

**Full flow:**
```
Push to GitHub (branch: main)
    ↓
CodePipeline (source: CodeStar Connection → GitHub)
    ├── Stage: BuildBackend (CodeBuild)
    │     ├── ./gradlew build -x test
    │     ├── docker build -t <ecr-uri>:$CODEBUILD_RESOLVED_SOURCE_VERSION .
    │     ├── docker push <ecr-uri>
    │     └── aws apprunner start-deployment (if image already existed)
    └── Stage: BuildFrontend (CodeBuild)
          ├── npm ci
          ├── npm run build (with VITE_* env vars injected by CodeBuild)
          ├── aws s3 sync dist/ s3://<bucket> --delete
          └── aws cloudfront create-invalidation --paths "/*"
```

**Local development (no Docker):**
- Backend: `./gradlew bootRun`
- Frontend: `npm run dev`

## Glossary

- **Pipeline**: The CI/CD automation system that builds, tests, and deploys code changes automatically
- **CodePipeline**: AWS service that orchestrates the continuous delivery pipeline with source, build, and deploy stages
- **CodeBuild**: AWS managed build service that compiles source code, runs tests, and produces deployable artifacts
- **CodeStar_Connection**: AWS service that provides a secure connection between AWS services and third-party source code providers such as GitHub
- **ECR**: Amazon Elastic Container Registry — a managed Docker container registry for storing, managing, and deploying container images
- **App_Runner**: AWS service that provides a fully managed container application platform for deploying containerized web applications
- **S3**: Amazon Simple Storage Service — object storage used here to host the static frontend bundle
- **CloudFront**: AWS content delivery network (CDN) service that caches and serves the frontend assets globally with low latency
- **buildspec**: A YAML file that defines the build commands and settings used by CodeBuild to run a build
- **privilegedMode**: A CodeBuild environment setting that enables running the Docker daemon inside the build container, required for building Docker images
- **CDK**: AWS Cloud Development Kit — an infrastructure-as-code framework used to provision all AWS resources programmatically
- **fat_JAR**: A Java archive file that contains the application code and all its dependencies in a single file, produced by `./gradlew build`
- **Dockerfile**: A text file containing instructions to assemble a Docker container image, used exclusively by the CodeBuild pipeline in this project

## Requirements

### Requirement 10: Pipeline Backend — CodeBuild + ECR + App Runner

**User Story:** As a developer, I want a CodeBuild project that builds the backend Docker image and deploys it to App Runner on every push to main, so that I never need Docker installed locally.

#### Acceptance Criteria

1. WHEN a push is made to the `main` branch, THE Pipeline SHALL trigger automatically via the CodeStar_Connection to GitHub.
2. WHEN the backend CodeBuild stage runs, THE Pipeline SHALL run `./gradlew build -x test` to produce the fat_JAR.
3. WHEN the backend CodeBuild stage runs, THE Pipeline SHALL build the Docker image using the `backend/Dockerfile` and push it to the ECR repository provisioned in Sprint 1.
4. WHEN the Docker image is pushed to ECR, THE Pipeline SHALL trigger an App_Runner redeployment so the new version is served.
5. WHEN the CodeBuild project runs, THE Pipeline SHALL use an environment with Docker daemon available (e.g., `BUILD_GENERAL1_SMALL` with `privilegedMode: true`).
6. WHEN the CodeBuild project authenticates to ECR, THE Pipeline SHALL use an IAM role with `ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, and `ecr:PutImage` permissions.

### Requirement 11: Pipeline Frontend — CodeBuild + S3 + CloudFront

**User Story:** As a developer, I want a CodeBuild project that builds the React bundle and deploys it to S3 + CloudFront on every push to main, so that the frontend is updated automatically without any local build step.

#### Acceptance Criteria

1. WHEN the frontend CodeBuild stage runs, THE Pipeline SHALL run `npm ci` followed by `npm run build`.
2. WHEN the frontend CodeBuild stage runs, THE Pipeline SHALL inject `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN`, and `VITE_API_BASE_URL` as environment variables from AWS Systems Manager Parameter Store or CodeBuild environment variables.
3. WHEN `npm run build` completes, THE Pipeline SHALL sync the `dist/` directory to the S3 bucket using `aws s3 sync dist/ s3://<FrontendBucketName> --delete`.
4. WHEN the S3 sync completes, THE Pipeline SHALL create a CloudFront cache invalidation for `/*` so updated assets are served immediately.
5. WHEN the CodeBuild project runs, THE Pipeline SHALL use an IAM role with `s3:PutObject`, `s3:DeleteObject`, `cloudfront:CreateInvalidation` permissions.

### Requirement 12: Pipeline Provisioning via CDK

**User Story:** As a developer, I want the entire CI/CD pipeline provisioned as code in the CDK stack, so that the pipeline itself is reproducible and version-controlled.

#### Acceptance Criteria

1. WHEN the CDK stack is deployed, THE Pipeline SHALL create a CodeStar_Connection to GitHub (requires one-time manual activation in the AWS console after deploy).
2. WHEN the CDK stack is deployed, THE Pipeline SHALL create a CodePipeline with two parallel build stages: `BuildBackend` and `BuildFrontend`.
3. WHEN the CDK stack is deployed, THE Pipeline SHALL create a buildspec (inline or as file) for the backend CodeBuild project defining the build, image tag, ECR push, and App_Runner deployment commands.
4. WHEN the CDK stack is deployed, THE Pipeline SHALL create a buildspec for the frontend CodeBuild project defining `npm ci`, `npm run build`, S3 sync, and CloudFront invalidation commands.
5. WHEN the CDK stack is deployed, THE Pipeline SHALL output the CodePipeline URL as a CloudFormation stack output (`PipelineUrl`) for easy access.
6. WHEN the CDK stack is deployed, THE Pipeline SHALL create all necessary IAM roles with least-privilege permissions for CodeBuild and CodePipeline.

### Requirement 13: Dockerfiles (pipeline use only)

**User Story:** As a developer, I want Dockerfiles for both services that are used exclusively by the CodeBuild pipeline, so that I never need Docker installed locally.

#### Acceptance Criteria

1. THE Pipeline SHALL provide a `backend/Dockerfile` that uses a multi-stage build: `eclipse-temurin:21-jdk-alpine` for the build stage and `eclipse-temurin:21-jre-alpine` for the runtime stage.
2. THE Pipeline SHALL ensure the `backend/Dockerfile` expects the fat_JAR to already exist in `build/libs/` (built by `./gradlew build` in a prior CodeBuild step).
3. THE Pipeline SHALL deploy the frontend as a static bundle directly to S3 without containerization — the `frontend/` directory SHALL NOT require a Dockerfile.
4. WHEN `backend/Dockerfile` is present in the repository, THE Pipeline SHALL ensure it is executable by the CodeBuild pipeline without any local pre-requisites.

### Requirement 14: Configuration and Documentation

**User Story:** As a developer, I want a `.env.example` and root-level README that document the no-Docker-local development workflow clearly.

#### Acceptance Criteria

1. WHEN the project is cloned, THE Pipeline SHALL include a `.env.example` at the root listing all environment variable keys with placeholder values and comments.
2. WHEN the project root `README.md` is read, THE Pipeline SHALL include a "Local Development" section as the primary workflow — no Docker:
   - Terminal 1: `cd backend && ./gradlew bootRun`
   - Terminal 2: `cd frontend && npm run dev`
3. WHEN the project root `README.md` is read, THE Pipeline SHALL include a "Deploy" section describing that deploy happens automatically on push to `main` via CodePipeline — no manual commands required.
4. WHEN the project root `README.md` is read, THE Pipeline SHALL list Docker as a **non-requirement** for local development, clearly stating it is used only by the CodeBuild pipeline in AWS.
5. WHEN the project root `README.md` is read, THE Pipeline SHALL document the one-time manual step required after `cdk deploy`: activating the CodeStar_Connection in the AWS console.

### Local Development (No Docker)

```bash
# Requires: Sprint 1 executed and CDK outputs available

# Terminal 1 — Backend
cd backend
export COGNITO_ISSUER_URI=https://cognito-idp.<region>.amazonaws.com/<UserPoolId>
export CORS_ALLOWED_ORIGINS=http://localhost:5173
./gradlew bootRun
# Available at: http://localhost:8080

# Terminal 2 — Frontend
cd frontend
# Create .env.local:
# VITE_COGNITO_USER_POOL_ID=<UserPoolId>
# VITE_COGNITO_CLIENT_ID=<UserPoolClientId>
# VITE_COGNITO_DOMAIN=<CognitoDomain>
# VITE_API_BASE_URL=http://localhost:8080
npm run dev
# Available at: http://localhost:5173
```

### Deploy (automatic via GitHub push)

```bash
git add .
git commit -m "feat: my change"
git push origin main
# CodePipeline is triggered automatically
# Monitor at: https://console.aws.amazon.com/codesuite/codepipeline
```

### Initial Infrastructure Setup

```bash
# 1. Provision all infrastructure + pipeline (Sprint 1)
cd infra && npx cdk bootstrap && npx cdk deploy

# 2. Activate the CodeStar Connection in the AWS console (one-time manual step)
# Console → Developer Tools → Connections → select the connection → "Update pending connection"

# 3. Make the first push to trigger the pipeline
git push origin main
```
