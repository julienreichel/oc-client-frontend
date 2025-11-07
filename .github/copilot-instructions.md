# OC Client Frontend - AI Coding Instructions

## Project Overview

This is a **Vue 3 + Quasar frontend** for a document sharing platform. Users access shared documents via unique access codes. The app communicates exclusively with the Client Backend API and is deployed on Kubernetes at `https://client.on-track.ch`.

## Architecture & Project Structure

### Key Layers (see `KNOWLEDGE_BASE.md`)

- **Models** (`src/components/models.ts`): Define data structures (PublicDocument, ApiError)
- **Providers**: HTTP communication abstraction layer (planned: HttpProvider, DocumentProvider)
- **Composables**: Reactive state management (planned: useDocumentByCode, useAccessCodeFromRoute)
- **Components**: UI organized by function (Access Flow, Document View, Shared components)

### Current vs Planned State

- **Current**: Basic Quasar boilerplate with example components
- **Planned**: Document access system with `/view/:code` routes, provider pattern, composables for document fetching

## Development Workflow

### Essential Commands

```bash
# Development (with hot reload)
quasar dev

# Production build
quasar build

# Linting & formatting
npm run lint
npm run format

# No tests configured yet
npm test  # Currently exits 0
```

### Build & Deployment

- **Docker**: Multi-stage build (Node.js build → Nginx serve)
- **K8s**: Deployed to `oc-client` namespace via GitHub Actions
- **CI/CD**: Builds on push to main, creates Docker image, deploys to K8s cluster

## Framework-Specific Patterns

### Quasar Usage Rules (from KNOWLEDGE_BASE.md)

- **Mandatory**: Use Quasar grid system (`q-page`, `row`, `col`, `q-card`, `q-toolbar`)
- **Avoid**: Manual div-based grids, inline styles, custom CSS
- **Prefer**: Horizontal row-based layouts over vertical stacking
- **Components**: Leverage `q-card` for grouping, Quasar theme variables for consistency

### Vue 3 + TypeScript Setup

- **Composition API**: All components use `<script setup lang="ts">`
- **Boot files**: `src/boot/` for app initialization (axios, i18n already configured)
- **Routing**: Vue Router with hash mode (`vueRouterMode: 'hash'`)
- **Build target**: ES2022, strict TypeScript enabled

### Internationalization Requirements

- **Mandatory**: All user-facing text must use Vue I18n (configured via `@intlify/unplugin-vue-i18n`)
- **Structure**: Translation keys by context (e.g., `document.send.success`)
- **Languages**: English (default), French/German planned
- **No hardcoded strings** in templates allowed

## Integration Points

### API Communication

- **Base setup**: `src/boot/axios.ts` provides `$api` instance
- **Current base URL**: `https://api.example.com` (needs update for Client Backend)
- **Pattern**: Create provider classes in separate files, not direct axios usage in components

### Routing Strategy

```typescript
// Current: Basic layout with IndexPage
// Planned: Document access flow
'/' → AccessPage (enter access code)
'/view/:code' → DocumentViewPage (display document)
'/:catchAll(.)' → NotFound
```

### State Management

- **No Pinia/Vuex**: Use composables with `reactive()` for cross-component state
- **Composables pattern**: Return reactive state + actions (load, reload, reset)
- **Error handling**: Unified via ApiError model and ErrorState component

## Commit & Release Conventions

### Commit Messages

```
type(scope): Description

Examples:
feat(document): Add access code validation
fix(layout): Prevent header overlap on mobile
refactor(providers): Extract HTTP error handling
```

### Release Process

```bash
git checkout main && git pull
git merge dev
npm version <patch|minor|major>
git push && git push --tags
# Create RELEASE-NOTES.md with high-level changes
```

## Development Guidelines

### File Organization

- **Models**: Define in `src/components/models.ts` or dedicated model files
- **Providers**: Create separate files for API communication logic
- **Composables**: Use `use*` naming convention, return reactive state
- **Components**: Organize by feature (Access/, Document/, Shared/)

### Code Quality

- **TypeScript**: Strict mode enabled, use proper typing
- **ESLint**: Flat config with Vue plugin, runs on pre-commit
- **Prettier**: Auto-formatting configured
- **Imports**: Use relative imports for local files, absolute for libs

### Testing Strategy

- **Unit Tests**: Vitest for testing utilities, composables, and logic functions
- **Component Tests**: Cypress for testing Vue components with Quasar integration
- **E2E Tests**: Cypress for full application workflows (future consideration)
- **Test Commands**: `npm test` (runs both unit and component), `npm run test:unit`, `npm run test:component`
- **Component Test Pattern**: Follow `MainLayout.cy.ts` example using `cy.mount()` for component testing

## Key Implementation Notes

When implementing the document access system:

1. **Start with models** (`PublicDocument`, `ApiError`) in `src/components/models.ts`
2. **Create providers** for API communication before building UI
3. **Build composables** for reactive state management
4. **Update routes** in `src/router/routes.ts` for `/view/:code` pattern
5. **Replace boilerplate** components with Access/Document flow components
6. **Ensure i18n** is used for all user-facing text from the start

The `KNOWLEDGE_BASE.md` contains detailed architectural specifications - refer to it for component responsibilities and UX guidelines.
