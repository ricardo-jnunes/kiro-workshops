# Requirements — Sprint 2: Backend Java (Spring Boot 3.x)

## Overview

A Java 21 / Spring Boot 3.x REST API built with Gradle (Kotlin DSL). Follows hexagonal architecture (ports and adapters) to decouple business logic from infrastructure concerns. Validates AWS Cognito JWTs for protected endpoints and exposes a health check. Deployed to **AWS App Runner** via a container image pushed to ECR.

---

## Requirement 3 — Health Check Endpoint

**User Story:** As a developer, I want a health check endpoint, so that I can verify the backend service is running correctly in any environment.

#### Acceptance Criteria

1. WHEN `GET /actuator/health` is called THEN the system SHALL return HTTP 200 with JSON body `{"status":"UP"}`.
2. WHEN the application starts THEN the system SHALL NOT require authentication to access `/actuator/health`.
3. WHEN the Gradle build runs via `./gradlew build` THEN the system SHALL produce an executable fat JAR.
4. WHEN the application starts via `./gradlew bootRun` THEN the system SHALL be accessible on port 8080.

---

## Requirement 4 — JWT-Protected /api/me Endpoint

**User Story:** As a developer, I want a protected endpoint that returns authenticated user claims, so that I can validate the end-to-end Cognito JWT integration.

#### Acceptance Criteria

1. WHEN `GET /api/me` is called with a valid Cognito JWT in the `Authorization: Bearer` header THEN the system SHALL return HTTP 200 with a JSON body containing the authenticated user's `sub` and `email` claims.
2. WHEN `GET /api/me` is called without an `Authorization` header THEN the system SHALL return HTTP 401.
3. WHEN `GET /api/me` is called with an expired JWT THEN the system SHALL return HTTP 401.
4. WHEN `GET /api/me` is called with a JWT signed by an unknown key THEN the system SHALL return HTTP 401.
5. WHEN the application starts THEN the system SHALL load the Cognito JWKS endpoint from the `COGNITO_ISSUER_URI` environment variable for automatic JWT validation.

---

## Requirement 5 — CORS Configuration

**User Story:** As a developer, I want CORS configured on the backend, so that the React frontend running in the browser can call the API.

#### Acceptance Criteria

1. WHEN the backend receives a cross-origin request from an origin listed in `CORS_ALLOWED_ORIGINS` THEN the system SHALL respond with the appropriate `Access-Control-Allow-Origin` header.
2. WHEN `CORS_ALLOWED_ORIGINS` is not set THEN the system SHALL default to allowing `http://localhost:5173`.
3. WHEN the backend receives a CORS preflight `OPTIONS` request THEN the system SHALL respond with HTTP 200 and the correct CORS headers.

---

## Requirement 6 — Hexagonal Architecture (Ports and Adapters)

**User Story:** As a developer, I want the backend structured with hexagonal architecture, so that business logic is fully decoupled from infrastructure and framework concerns, making the codebase easier to test and extend.

#### Acceptance Criteria

1. THE source code SHALL be organized into three layers:
   - `domain/` — pure business logic: domain models and port interfaces (no Spring, no framework imports).
   - `application/` — use case classes that orchestrate domain logic by depending only on port interfaces.
   - `infrastructure/` — adapters that implement port interfaces: REST controllers, Spring Security config, and any external service clients.
2. WHEN a use case class is instantiated in a unit test THEN the system SHALL be testable without loading the Spring application context, by injecting mock implementations of the port interfaces.
3. THE `domain/` package SHALL NOT contain any import from `org.springframework`, `jakarta.servlet`, or any other framework package.
4. WHEN a new external dependency (database, messaging, third-party API) is introduced THEN the system SHALL define it as a port interface in `domain/ports/` and implement it as an adapter in `infrastructure/`.
5. THE `GET /api/me` feature SHALL be implemented as:
   - A `GetCurrentUserUseCase` class in `application/` that depends on a `UserIdentityPort` interface in `domain/ports/`.
   - A `CognitoUserIdentityAdapter` in `infrastructure/` that implements `UserIdentityPort` by extracting claims from the Spring Security JWT context.
   - A `MeController` in `infrastructure/web/` that delegates to `GetCurrentUserUseCase`.
6. WHEN the Gradle project is structured THEN the package root SHALL be `com.example.poc` with sub-packages `domain`, `application`, and `infrastructure` directly beneath it.

---

## Requirement 7 — Container Image and App Runner Deployment

**User Story:** As a developer, I want the backend packaged as a container image and deployable to AWS App Runner via ECR, so that I can ship a production-ready service without managing infrastructure.

#### Acceptance Criteria

1. THE `backend/Dockerfile` SHALL use a multi-stage build:
   - Stage `builder`: `eclipse-temurin:21-jdk-alpine` — runs `./gradlew build -x test` and produces the fat JAR.
   - Stage `runtime`: `eclipse-temurin:21-jre-alpine` — copies the JAR and sets the entrypoint.
2. WHEN the container image is built THEN the system SHALL expose port 8080.
3. WHEN the container image is pushed to ECR and the App Runner service is updated THEN the service SHALL become healthy within 5 minutes, verified by `GET /actuator/health` returning HTTP 200.
4. WHEN the App Runner service is running THEN the system SHALL read `COGNITO_ISSUER_URI` and `CORS_ALLOWED_ORIGINS` from the App Runner environment variable configuration (provisioned in Sprint 1).
5. THE `backend/` directory SHALL include a `deploy.sh` script (or equivalent Makefile target) with the commands to build, tag, push the image to ECR, and trigger an App Runner redeployment.

---

## Running Sprint 2 in Isolation

```bash
cd backend
# Requires Sprint 1 outputs
export COGNITO_ISSUER_URI=https://cognito-idp.<region>.amazonaws.com/<UserPoolId>
export CORS_ALLOWED_ORIGINS=http://localhost:5173

./gradlew bootRun     # start server on :8080
./gradlew test        # run unit and integration tests
./gradlew build       # produce executable JAR

# Verify health check
curl http://localhost:8080/actuator/health

# Deploy to App Runner (requires Sprint 1 deployed and AWS credentials)
# ./deploy.sh <ecr-repo-uri> <apprunner-service-arn>
```
