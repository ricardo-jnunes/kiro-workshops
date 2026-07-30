# Requirements — Sprint 3: Frontend React (Vite + TypeScript)

## Overview

A minimal React SPA built with Vite and TypeScript. Uses AWS Amplify v6 for Cognito authentication. Styled exclusively with CSS Modules — no UI library dependencies. Independently runnable after Sprint 1 outputs are available.

---

## Requirement 6 — Login Page and Cognito Authentication

**User Story:** As a user, I want a login page integrated with AWS Cognito, so that I can authenticate and access protected areas of the application.

#### Acceptance Criteria

1. WHEN an unauthenticated user visits any protected route THEN the system SHALL redirect them to the `/login` route.
2. WHEN a user submits valid credentials on the login page THEN the system SHALL authenticate via AWS Amplify and redirect to the home page `/`.
3. WHEN a user submits invalid credentials THEN the system SHALL display a human-readable error message below the submit button without clearing the email field.
4. WHEN a user clicks the logout button THEN the system SHALL invalidate the Cognito session and redirect to `/login`.
5. WHEN the application loads THEN the system SHALL configure AWS Amplify using environment variables `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID`.

---

## Requirement 7 — Protected Home Page and Backend Integration

**User Story:** As an authenticated user, I want a protected home page that shows my profile and backend data, so that I can confirm full-stack connectivity.

#### Acceptance Criteria

1. WHEN an authenticated user visits `/` THEN the system SHALL display a protected home page with the user's email address.
2. WHEN the home page loads THEN the system SHALL call `GET /api/me` on the backend with the Cognito JWT as a Bearer token and display the returned `sub` and `email` claims.
3. WHEN the `/api/me` call fails THEN the system SHALL display a friendly error message without crashing the application.
4. WHEN an unauthenticated user navigates directly to `/` THEN the system SHALL redirect them to `/login`.

---

## Requirement 8 — Styling and Developer Experience

**User Story:** As a developer, I want the React app to use CSS Modules with no UI library, so that the template stays lightweight and fully customizable.

#### Acceptance Criteria

1. WHEN any component is created THEN the system SHALL use CSS Modules (`.module.css`) for all component-level styling.
2. WHEN the application dependencies are installed THEN the system SHALL NOT include any third-party UI component library (no MUI, Ant Design, Chakra, etc.).
3. WHEN the application is built via `npm run build` THEN the system SHALL produce a production-ready static bundle.
4. WHEN running in development via `npm run dev` THEN the system SHALL start on port 5173.

---

## Running Sprint 3 in Isolation

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with Sprint 1 outputs:
# VITE_COGNITO_USER_POOL_ID=<value>
# VITE_COGNITO_CLIENT_ID=<value>
# VITE_API_BASE_URL=http://localhost:8080

npm install
npm run dev       # dev server on :5173
npm run build     # production build
npm test          # Vitest unit tests
```
