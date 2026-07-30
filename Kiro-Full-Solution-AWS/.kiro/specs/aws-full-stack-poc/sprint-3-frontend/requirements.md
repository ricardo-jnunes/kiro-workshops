# Requirements — Sprint 3: Frontend React (Vite + TypeScript)

## Overview

A minimal React SPA built with Vite and TypeScript. Uses AWS Amplify v6 for Cognito authentication. Styled exclusively with CSS Modules. Deployed to **AWS S3 + CloudFront** — the build and S3 sync happen exclusively in the **CodeBuild pipeline** (Sprint 4), never locally.

**Local development:** `npm run dev` — no Docker, no manual production builds.

---

## Requirement 6 — Login Page and Cognito Authentication

**User Story:** As a user, I want a login page integrated with AWS Cognito, so that I can authenticate and access protected areas of the application.

#### Acceptance Criteria

1. WHEN an unauthenticated user visits any protected route THEN the system SHALL redirect them to the `/login` route.
2. WHEN a user submits valid credentials THEN the system SHALL authenticate via AWS Amplify and redirect to `/`.
3. WHEN a user submits invalid credentials THEN the system SHALL display a human-readable error message below the submit button without clearing the email field.
4. WHEN a user clicks the logout button THEN the system SHALL invalidate the Cognito session and redirect to `/login`.
5. WHEN the application loads THEN the system SHALL configure AWS Amplify using `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID`.

---

## Requirement 7 — Protected Home Page and Backend Integration

**User Story:** As an authenticated user, I want a protected home page that shows my profile and backend data, so that I can confirm full-stack connectivity.

#### Acceptance Criteria

1. WHEN an authenticated user visits `/` THEN the system SHALL display the user's email address.
2. WHEN the home page loads THEN the system SHALL call `GET /api/me` with the Cognito JWT as Bearer token and display the returned `sub` and `email` claims.
3. WHEN the `/api/me` call fails THEN the system SHALL display a friendly error message without crashing.
4. WHEN an unauthenticated user navigates directly to `/` THEN the system SHALL redirect to `/login`.

---

## Requirement 8 — Styling and Developer Experience

**User Story:** As a developer, I want the React app to use CSS Modules with no UI library, so that the template stays lightweight and fully customizable.

#### Acceptance Criteria

1. WHEN any component is created THEN the system SHALL use CSS Modules (`.module.css`) for all styling.
2. WHEN dependencies are installed THEN the system SHALL NOT include any third-party UI component library.
3. WHEN `npm run build` runs THEN the system SHALL produce a static bundle in `dist/`.
4. WHEN `npm run dev` runs THEN the system SHALL start on port 5173.

---

## Requirement 9 — Static Bundle Build for Pipeline Deployment

**User Story:** As a developer, I want the React app structured so that the CodeBuild pipeline can build and deploy it to S3 + CloudFront automatically on every push, without any local build or deploy step.

#### Acceptance Criteria

1. WHEN the CodeBuild pipeline runs `npm run build` THEN the system SHALL produce a deployable bundle in `dist/` using the `VITE_*` environment variables injected by CodeBuild.
2. WHEN the frontend is built for production THEN the system SHALL read `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN`, and `VITE_API_BASE_URL` from environment variables provided by CodeBuild, not from local files.
3. THE `frontend/` directory SHALL NOT include a `Dockerfile` — the frontend is deployed as a static bundle directly to S3, not as a container.
4. WHEN a user navigates directly to a sub-route (e.g. `/login`) on the CloudFront domain THEN the system SHALL receive `index.html` with HTTP 200, handled by the CloudFront error page configuration in Sprint 1.
5. THE `frontend/` directory SHALL include a `.env.example` listing all required `VITE_*` variable names for local development reference.

---

## Local Development (No Docker)

```bash
cd frontend
cp .env.example .env.local
# Fill in .env.local with Sprint 1 outputs:
# VITE_COGNITO_USER_POOL_ID=<UserPoolId>
# VITE_COGNITO_CLIENT_ID=<UserPoolClientId>
# VITE_COGNITO_DOMAIN=<CognitoDomain>
# VITE_API_BASE_URL=http://localhost:8080

npm install
npm run dev    # hot reload on :5173
npm test       # Vitest
```

> Deployment happens automatically via CodePipeline on every push to GitHub (configured in Sprint 1).
