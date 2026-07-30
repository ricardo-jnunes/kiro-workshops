# Requirements — Sprint 1: IaC (AWS CDK)

## Overview

Provision all AWS resources required by the POC using AWS CDK with TypeScript. This sprint is independently deployable and produces the Cognito, App Runner, and CloudFront configuration values consumed by all other sprints.

**Hosting decisions:**
- Backend → AWS App Runner (container from ECR)
- Frontend → AWS S3 + CloudFront (static bundle)

---

## Requirement 1 — Cognito User Pool Provisioning

**User Story:** As a developer, I want to provision an AWS Cognito User Pool via IaC, so that I can have a repeatable and version-controlled authentication infrastructure.

#### Acceptance Criteria

1. WHEN the CDK stack is synthesized THEN the system SHALL produce a CloudFormation template that includes a Cognito User Pool with email as the primary sign-in attribute.
2. WHEN the CDK stack is deployed THEN the system SHALL create a Cognito User Pool Client named `aws-full-stack-poc-client` with `ALLOW_USER_SRP_AUTH` and `ALLOW_REFRESH_TOKEN_AUTH` auth flows enabled and no client secret.
3. WHEN the CDK stack is deployed THEN the system SHALL output the User Pool ID, User Pool Client ID, and Cognito hosted domain as CloudFormation stack outputs.
4. WHEN the CDK stack is deployed THEN the system SHALL enforce a password policy requiring minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit.
5. WHEN the CDK stack is deployed THEN the system SHALL enable self-registration (sign-up) so new users can create accounts without administrator intervention.
6. WHEN the CDK stack is deployed THEN the system SHALL tag all resources with `Project: aws-full-stack-poc` and `Environment: dev`.

---

## Requirement 2 — Backend Hosting: AWS App Runner + ECR

**User Story:** As a developer, I want the backend container hosted on AWS App Runner with an ECR registry, so that I can deploy the Spring Boot service without managing clusters, load balancers, or VPCs.

#### Acceptance Criteria

1. WHEN the CDK stack is deployed THEN the system SHALL create an ECR private repository named `aws-full-stack-poc-backend` to store the backend container image.
2. WHEN the CDK stack is deployed THEN the system SHALL create an AWS App Runner service that pulls the backend image from the ECR repository.
3. WHEN the App Runner service starts THEN the system SHALL pass `COGNITO_ISSUER_URI` and `CORS_ALLOWED_ORIGINS` as environment variables to the container.
4. WHEN the CDK stack is deployed THEN the system SHALL configure the App Runner health check to call `GET /actuator/health` and expect HTTP 200.
5. WHEN the CDK stack is deployed THEN the system SHALL create an IAM role granting the App Runner service permission to pull images from the ECR repository.
6. WHEN the CDK stack is deployed THEN the system SHALL output the App Runner service URL as a CloudFormation stack output (`BackendUrl`).
7. WHEN the CDK stack is deployed THEN the system SHALL configure the App Runner service with auto-scaling: minimum 1 instance, maximum 3 instances.

---

## Requirement 3 — Frontend Hosting: S3 + CloudFront

**User Story:** As a developer, I want the React frontend hosted on S3 with CloudFront as CDN, so that I can serve the static bundle globally with HTTPS and low latency.

#### Acceptance Criteria

1. WHEN the CDK stack is deployed THEN the system SHALL create a private S3 bucket for hosting the frontend static bundle with public access blocked.
2. WHEN the CDK stack is deployed THEN the system SHALL create a CloudFront distribution with the S3 bucket as origin, using Origin Access Control (OAC) so the bucket is never publicly accessible.
3. WHEN the CDK stack is deployed THEN the system SHALL configure the CloudFront distribution with a default root object of `index.html`.
4. WHEN a CloudFront request returns 403 or 404 THEN the system SHALL return `index.html` with HTTP 200 to support client-side React Router navigation.
5. WHEN the CDK stack is deployed THEN the system SHALL output the CloudFront distribution domain name as a CloudFormation stack output (`FrontendUrl`).
6. WHEN the CDK stack is deployed THEN the system SHALL output the S3 bucket name as a CloudFormation stack output (`FrontendBucketName`) so the CI/CD pipeline can sync the build artifacts.

---

## Requirement 4 — CDK Project Structure and Developer Experience

**User Story:** As a developer, I want a well-structured CDK project in `infra/`, so that I can deploy and destroy all AWS resources with a single command.

#### Acceptance Criteria

1. WHEN a developer runs `npx cdk synth` from within the `infra/` directory THEN the system SHALL synthesize without errors.
2. WHEN a developer runs `npx cdk deploy` from within the `infra/` directory THEN the system SHALL provision all resources idempotently.
3. WHEN a developer runs `npx cdk destroy` from within the `infra/` directory THEN the system SHALL remove all provisioned resources without manual intervention.
4. THE `infra/` directory SHALL contain a `README.md` documenting prerequisites (Node.js 20+, AWS CLI v2, CDK bootstrap) and step-by-step deployment instructions including `npx cdk bootstrap` as a prerequisite step.
5. WHEN CDK assertion tests are run via `npm test` THEN the system SHALL validate that the synthesized CloudFormation template contains the expected User Pool, ECR repository, App Runner service, S3 bucket, CloudFront distribution, and all stack outputs.

---

## Running Sprint 1 in Isolation

```bash
cd infra
npm install
npx cdk bootstrap   # first time only
npx cdk synth       # validate template
npx cdk deploy      # provision to AWS
npm test            # run CDK assertion tests
npx cdk destroy     # clean up all resources
```

**Outputs to collect after deploy** (used by other sprints):

| Output | Used by |
|--------|---------|
| `UserPoolId` | Sprint 2 (backend env var), Sprint 3 (frontend env var) |
| `UserPoolClientId` | Sprint 3 (frontend env var) |
| `CognitoDomain` | Sprint 3 (frontend env var) |
| `BackendUrl` | Sprint 3 (`VITE_API_BASE_URL`), Sprint 4 (`.env`) |
| `FrontendUrl` | Sprint 2 (`CORS_ALLOWED_ORIGINS`), Sprint 4 (`.env`) |
| `FrontendBucketName` | Sprint 4 (deploy pipeline — `aws s3 sync`) |
