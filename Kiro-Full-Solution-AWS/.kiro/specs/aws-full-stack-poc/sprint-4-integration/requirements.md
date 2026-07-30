# Requirements — Sprint 4: Docker Compose & Integration

## Overview

Full-stack local orchestration using Docker Compose. Both services (frontend + backend) are containerized with multi-stage Dockerfiles and wired together via a shared `.env` file. This sprint represents the final integrated deliverable.

---

## Requirement 9 — Docker Compose Orchestration

**User Story:** As a developer, I want a Docker Compose file at the project root that starts all services with a single command, so that I can run the full stack locally for integration testing.

#### Acceptance Criteria

1. WHEN `docker compose up --build` is run from the project root THEN the system SHALL build and start both the `backend` and `frontend` containers.
2. WHEN the `backend` container starts THEN the system SHALL be accessible on host port 8080.
3. WHEN the `frontend` container starts THEN the system SHALL be accessible on host port 3000.
4. WHEN the Docker Compose starts THEN the `frontend` service SHALL only start after the `backend` service passes its health check at `GET /actuator/health`.
5. WHEN the Docker Compose starts THEN both services SHALL read Cognito configuration from a `.env` file at the project root.
6. WHEN the frontend container is running THEN API calls to `/api/*` SHALL be proxied to the backend container via the internal Docker network (not via host).

---

## Requirement 10 — Dockerfiles (Multi-Stage Builds)

**User Story:** As a developer, I want Dockerfiles for both services using multi-stage builds, so that the resulting images are minimal and production-grade.

#### Acceptance Criteria

1. WHEN `docker build` is run in the `backend/` directory THEN the system SHALL produce a runnable image using `eclipse-temurin:21-jdk-alpine` for the build stage and `eclipse-temurin:21-jre-alpine` for the runtime stage.
2. WHEN `docker build` is run in the `frontend/` directory THEN the system SHALL produce an image using `node:20-alpine` for the build stage and `nginx:alpine` for the runtime stage.
3. WHEN the frontend Docker image runs THEN nginx SHALL serve the static bundle and proxy `/api/*` requests to the backend.

---

## Requirement 11 — Configuration and Documentation

**User Story:** As a developer, I want a `.env.example` and root-level documentation, so that I can configure and run the project in under 10 minutes.

#### Acceptance Criteria

1. WHEN the project is cloned THEN the system SHALL include a `.env.example` at the root listing all required environment variable keys with placeholder values and inline documentation comments.
2. WHEN the project root `README.md` is read THEN the system SHALL include a "Quick Start" section with numbered steps to clone, configure `.env`, and run `docker compose up --build`.
3. WHEN the project root `README.md` is read THEN the system SHALL include an "AWS Deployment" section with steps for `npx cdk bootstrap`, `npx cdk deploy`, and instructions for copying stack outputs to `.env`.
4. WHEN the project root `README.md` is read THEN the system SHALL list prerequisite tools and their minimum versions: Node.js 20+, Java 21, Docker 24+, Docker Compose v2, AWS CLI v2, AWS CDK v2.

---

## Running Sprint 4 (Full Stack)

```bash
# At project root — requires Sprint 1 outputs in .env
cp .env.example .env
# Fill in .env with real Cognito values from `cdk deploy` output

docker compose up --build
# Backend available at: http://localhost:8080
# Frontend available at: http://localhost:3000
```
