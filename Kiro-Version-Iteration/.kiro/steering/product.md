# Product Overview

**Kiro-Version-Iteration** is an internal-use Angular SPA for visual task management via a Kanban board.

## Core Functionality

- Kanban board with three fixed columns: **Backlog**, **In Progress**, **Done**
- Cards with title, description, priority (`baixa`, `média`, `alta`), and status
- Drag-and-drop to move cards between columns
- Create, edit, and delete cards via a reactive form (modal or side panel)
- Real-time UI updates using Angular Signals — no page reloads

## Target Users

Internal team members who need to track and manage workflow tasks visually.

## Key Constraints

- All data is stored in-memory (mock service) — no backend integration in the current iteration
- The `Card_Service` must implement a domain port interface to allow future API replacement without touching consumers
