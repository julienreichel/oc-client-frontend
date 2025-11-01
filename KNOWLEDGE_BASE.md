# OC Client Frontend — Knowledge Base

## 🎯 Purpose

The **Client Frontend** is a lightweight, public-facing application that allows end users to access and view documents that have been shared with them by a provider.
The application is optimized for reliability, clarity, and speed — it must be simple to use, work on any device, and handle expired or invalid links gracefully.

It communicates exclusively with the **Client Backend** to retrieve document data, using a unique access code provided by the provider’s system.

---

## 🧩 General Architecture

The application follows a **modular architecture** typical of modern Vue 3 + Quasar projects.
It is organized into several logical layers:

1. **Models** — define the structure of data exchanged with the backend.
2. **Providers** — handle communication with the backend and other external systems.
3. **Composables** — manage reusable state and logic for pages and components.
4. **Components** — define the visual and interactive elements of the user interface.

Each layer has a clear responsibility and minimal coupling to ensure maintainability and scalability.

---

## 🗂 Models

Models describe the entities manipulated in the application and mirror the main backend objects.

### Proposed Models

| Model Name         | Description                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **PublicDocument** | Represents the document the user is allowed to view. Includes attributes such as title, content, creation date, and optional metadata (e.g., language, tags). |     |
| **ApiError**       | Represents possible backend errors such as invalid link, expired document, or unavailable service.                                                            |

### Relationships

- Each **PublicDocument** is accessed using a unique **access code**.
- Errors are represented as **ApiError** instances and displayed in a unified format.

---

## 🔌 Providers

Providers act as an abstraction layer between the frontend and the backend.
They encapsulate all HTTP requests and backend communication, so the rest of the app never deals directly with URLs or API details.

### Required Providers

| Provider             | Responsibility                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **HttpProvider**     | Centralized configuration for network requests, including base URL, timeout, and error handling.      |
| **DocumentProvider** | Manages document retrieval from the backend. Handles all interactions with `/api/public/:accessCode`. |

Each provider should expose a simple and predictable interface, returning structured data that matches the defined models.

---

## 🪄 Composables

Composables handle reusable logic and application state across multiple pages and components.
They improve maintainability by keeping pages declarative and logic centralized.

### Core Composables

| Composable                 | Description                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **useDocumentByCode**      | Fetches and manages the state of a document based on an access code. Tracks loading, success, and error states. |
| **useAccessCodeFromRoute** | Extracts and validates the access code from the route, ensuring it is present and properly formatted.           |
| **useUiState (optional)**  | Manages application-level indicators such as global loading or alert banners.                                   |

Composables should return reactive state objects and expose clear actions (e.g., load, reload, reset).

---

## 🧱 Components

The UI is divided into functional areas that correspond to the main user actions and application states.

### 1. Layout Components

| Component        | Role                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------- |
| **PublicLayout** | The root layout used for all public pages. Contains branding, header, and footer areas. |

### 2. Access Flow Components

| Component       | Role                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| **AccessInput** | Simple input form allowing users to enter their access code manually.                                    |
| **AccessPage**  | Landing page presenting the access form and redirecting to the document view upon successful validation. |

### 3. Document View Components

| Component            | Role                                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **DocumentViewPage** | Main page displaying the shared document. Handles loading and error states through composables.                                   |
| **DocumentViewer**   | Displays the title, content, metadata, and provider information of the document. Includes formatting and sanitization of content. |

### 4. Shared Components

| Component        | Role                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **LoadingState** | Unified component to display loading animations and messages.                                |
| **ErrorState**   | Displays friendly messages for common errors such as “link expired” or “document not found.” |
| **NotFound**     | Catch-all component for invalid routes or missing pages.                                     |

## 🌍 Internationalization (i18n)

Internationalization is **mandatory** in all user-facing text and labels.

### Guidelines

- Use Vue I18n or Quasar’s built-in internationalization system.
- Every text string must be translated via the i18n resource files — no hardcoded text in templates.
- Translation keys should be semantic and structured by context (e.g., `document.send.success`).
- Default language: **English**, with support for **French** and **German** in the future.
- The language should be automatically detected from browser settings and adjustable via a language selector in settings.

This ensures future adaptability for multilingual users and institutions.

---

## 🎨 Layout and Styling Rules

### Use of Quasar Components

- **All layouts must use Quasar’s grid system (`<q-page>`, `row`, `col`, `card`, `toolbar`, etc.)**.
- Avoid manually defining `div`-based grids — prefer Quasar’s responsive utilities.
- Leverage **Quasar Cards** for visual grouping (documents, modals, summaries).
- Avoid vertical “column” stacking unless logically necessary; favor **horizontal row-based layouts** for clarity and responsiveness.

### Styling Rules

- **No inline styles.** Use classes, props, or Quasar utility classes instead.
- **Reduce custom CSS to the strict minimum.** If styling is required, define scoped CSS in component files with meaningful class names.
- Use Quasar theme variables for colors, spacing, and typography.
- Maintain visual consistency across components — spacing, border-radius, and shadow should match Quasar defaults.
- Dark mode support should be considered but optional at this stage.

These rules ensure maintainability, visual harmony, and compliance with Quasar’s responsive design principles.

---

## 🧭 Navigation Structure

| Route             | Page                 | Description                                                |
| ----------------- | -------------------- | ---------------------------------------------------------- |
| `/`               | **AccessPage**       | Default entry point, allows users to enter an access code. |
| `/view/:code`     | **DocumentViewPage** | Displays the document associated with the access code.     |
| `/:catchAll(.*)*` | **NotFound**         | Fallback for unknown or invalid routes.                    |

This routing structure ensures users always start with the access page, and invalid URLs are handled gracefully.

---

## 🧠 UX & Interaction Guidelines

- **Simplicity first:** Only essential information should be displayed.
- **Clarity in errors:** Users must clearly understand when a link is invalid, expired, or unavailable.
- **Accessibility:** Use readable typography, high contrast, and mobile-friendly layouts.
- **Responsiveness:** The interface should adapt gracefully to various screen sizes.
- **Offline handling (future):** Consider caching for short-term disconnections.

---

## ⚙️ Development & Deployment Notes

- Built with **Vue 3 + Quasar** using a single-page application structure.
- Communicates exclusively with the **Client Backend**.
- Deployed under the `oc-client` namespace.
- Exposed through **Nginx** and accessible at `https://client.on-track.ch`.
- CI/CD pipeline builds the Quasar app, pushes the Docker image to GHCR, and applies Kubernetes manifests (`deployment.yaml`, `service.yaml`, `ingress.yaml`).

## Commit Message Rules

```
type(scope): Description
```

Examples:

```
feat(workspace): Add Save to Library button
fix(prescriptions): Prevent sending summary before finalize
refactor(composables): Extract persona state logic from workspace
```

---

## Release Flow

```
git checkout main
git pull
git merge dev
npm version <patch|minor|major>
git push && git push --tags
Create RELEASE-NOTES.md (manual high-level wording)
```
