# Requirements — Sprint 1: IaC (AWS CDK)

## Overview

Provision all AWS resources required by the POC using AWS CDK with TypeScript. This sprint is independently deployable and produces the Cognito configuration values consumed by all other sprints.

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

## Requirement 2 — CDK Project Structure and Developer Experience

**User Story:** As a developer, I want a well-structured CDK project in `infra/`, so that I can deploy and destroy all AWS resources with a single command.

#### Acceptance Criteria

1. WHEN a developer runs `npx cdk synth` from within the `infra/` directory THEN the system SHALL synthesize without errors.
2. WHEN a developer runs `npx cdk deploy` from within the `infra/` directory THEN the system SHALL provision all resources idempotently.
3. WHEN a developer runs `npx cdk destroy` from within the `infra/` directory THEN the system SHALL remove all provisioned resources without manual intervention.
4. THE `infra/` directory SHALL contain a `README.md` documenting prerequisites (Node.js 20+, AWS CLI v2, CDK bootstrap) and step-by-step deployment instructions including `npx cdk bootstrap` as a prerequisite step.
5. WHEN CDK assertion tests are run via `npm test` THEN the system SHALL validate that the synthesized CloudFormation template contains the expected User Pool, User Pool Client, and stack outputs.

---

## Running Sprint 1 in Isolation

```bash
cd infra
npm install
npx cdk bootstrap   # first time only
npx cdk synth       # validate template
npx cdk deploy      # provision to AWS
npm test            # run CDK assertion tests
npx cdk destroy     # clean up resources
```

**Outputs to collect after deploy** (used in `.env` for other sprints):
- `UserPoolId`
- `UserPoolClientId`
- `CognitoDomain`
