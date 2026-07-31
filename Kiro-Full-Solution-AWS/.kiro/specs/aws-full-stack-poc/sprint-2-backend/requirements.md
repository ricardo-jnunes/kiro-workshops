# Requirements Document

## Introduction

A Java 21 / Spring Boot 3.x REST API built with Gradle (Kotlin DSL). Follows hexagonal architecture (ports and adapters). Deployed to **AWS App Runner** via ECR — the Docker build and push happen exclusively in the **CodeBuild pipeline** (Sprint 4), never locally.

**Local development:** `./gradlew bootRun` — no Docker required.

## Glossary

- **Backend_System**: The Java 21 / Spring Boot 3.x REST API application built with Gradle (Kotlin DSL)
- **Health_Check**: The Spring Boot Actuator health endpoint (`/actuator/health`) used to verify service availability
- **JWT**: JSON Web Token issued by AWS Cognito, used for authenticating API requests
- **Cognito**: AWS Cognito User Pool service that issues and validates JWTs
- **JWKS**: JSON Web Key Set endpoint published by Cognito for JWT signature verification
- **CORS**: Cross-Origin Resource Sharing, a browser security mechanism controlling cross-origin HTTP requests
- **Hexagonal_Architecture**: A software architecture pattern (ports and adapters) that decouples business logic from infrastructure concerns
- **Fat_JAR**: A self-contained executable JAR file containing all dependencies, produced by `./gradlew build`
- **App_Runner**: AWS App Runner service that hosts the containerized backend application
- **ECR**: Amazon Elastic Container Registry used to store Docker images for deployment
- **CodeBuild**: AWS CodeBuild service that builds the Docker image and pushes it to ECR

## Requirements

### Requirement 3: Health Check Endpoint

**User Story:** As a developer, I want a health check endpoint, so that I can verify the backend service is running correctly in any environment.

#### Acceptance Criteria

1. WHEN `GET /actuator/health` is called, THE Backend_System SHALL return HTTP 200 with JSON body `{"status":"UP"}`.
2. WHEN the application starts, THE Backend_System SHALL allow unauthenticated access to `/actuator/health`.
3. WHEN `./gradlew build` runs, THE Backend_System SHALL produce an executable fat JAR in `build/libs/`.
4. WHEN `./gradlew bootRun` runs, THE Backend_System SHALL be accessible on port 8080.

### Requirement 4: JWT-Protected /api/me Endpoint

**User Story:** As a developer, I want a protected endpoint that returns authenticated user claims, so that I can validate the end-to-end Cognito JWT integration.

#### Acceptance Criteria

1. WHEN `GET /api/me` is called with a valid Cognito JWT in the `Authorization: Bearer` header, THE Backend_System SHALL return HTTP 200 with a JSON body containing the authenticated user's `sub` and `email` claims.
2. WHEN `GET /api/me` is called without an `Authorization` header, THE Backend_System SHALL return HTTP 401.
3. WHEN `GET /api/me` is called with an expired JWT, THE Backend_System SHALL return HTTP 401.
4. WHEN `GET /api/me` is called with a JWT signed by an unknown key, THE Backend_System SHALL return HTTP 401.
5. WHEN the application starts, THE Backend_System SHALL load the Cognito JWKS endpoint from the `COGNITO_ISSUER_URI` environment variable for automatic JWT validation.

### Requirement 5: CORS Configuration

**User Story:** As a developer, I want CORS configured on the backend, so that the React frontend running in the browser can call the API.

#### Acceptance Criteria

1. WHEN the Backend_System receives a cross-origin request from an origin listed in `CORS_ALLOWED_ORIGINS`, THE Backend_System SHALL respond with the appropriate `Access-Control-Allow-Origin` header.
2. WHEN `CORS_ALLOWED_ORIGINS` is not set, THE Backend_System SHALL default to allowing `http://localhost:5173`.
3. WHEN the Backend_System receives a CORS preflight `OPTIONS` request, THE Backend_System SHALL respond with HTTP 200 and the correct CORS headers.

### Requirement 6: Hexagonal Architecture (Ports and Adapters)

**User Story:** As a developer, I want the backend structured with hexagonal architecture, so that business logic is fully decoupled from infrastructure and framework concerns.

#### Acceptance Criteria

1. THE Backend_System SHALL organize source code into three layers:
   - `domain/` — pure business logic: domain models and port interfaces (no Spring, no framework imports).
   - `application/` — use case classes depending only on port interfaces.
   - `infrastructure/` — adapters: REST controllers, Spring Security config, Cognito adapter.
2. WHEN a use case class is instantiated in a unit test, THE Backend_System SHALL be testable without loading the Spring application context.
3. THE `domain/` package SHALL NOT contain any import from `org.springframework` or `jakarta.servlet`.
4. THE Backend_System SHALL implement the `GET /api/me` feature as:
   - `GetCurrentUserUseCase` in `application/`
   - `UserIdentityPort` interface in `domain/ports/`
   - `CognitoUserIdentityAdapter` in `infrastructure/`
   - `MeController` in `infrastructure/web/`
5. WHEN the Gradle project is structured, THE Backend_System SHALL use package root `com.example.poc` with sub-packages `domain`, `application`, and `infrastructure`.

### Requirement 7: Dockerfile (pipeline use only)

**User Story:** As a developer, I want a Dockerfile in the backend that is used exclusively by the CodeBuild pipeline, so that the production image is built in AWS without any local Docker requirement.

#### Acceptance Criteria

1. THE `backend/Dockerfile` SHALL copy the fat JAR from `build/libs/` (already produced by `./gradlew build` in the CodeBuild step) and run it using `eclipse-temurin:21-jre-alpine` as the base image.
2. WHEN the container image is built, THE Backend_System SHALL expose port 8080.
3. WHEN the container image is pushed to ECR by the pipeline, THE App_Runner service SHALL become healthy within 5 minutes.
4. THE `backend/Dockerfile` SHALL NOT be required for local development — `./gradlew bootRun` is the local workflow.

### Local Development (No Docker)

```bash
cd backend
export COGNITO_ISSUER_URI=https://cognito-idp.<region>.amazonaws.com/<UserPoolId>
export CORS_ALLOWED_ORIGINS=http://localhost:5173

./gradlew bootRun   # starts on :8080
./gradlew test      # run unit + integration tests
./gradlew build     # produce JAR (used by the pipeline)

curl http://localhost:8080/actuator/health
```

> Deployment happens automatically via CodePipeline on every push to GitHub (configured in Sprint 1).
