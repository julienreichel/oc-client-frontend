# OC Client Frontend

A lightweight, public-facing Vue 3 + Quasar application that allows end users to access and view documents shared via unique access codes. This frontend communicates exclusively with the Client Backend API and is optimized for reliability, clarity, and speed across all devices.

**🌐 Live Application**: https://client.on-track.ch

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 6.13.4+ or yarn 1.21.1+

### Installation & Development

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server (hot-reload enabled)
quasar dev

# Build for production
quasar build
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests (currently none configured)
npm test
```

## 🏗️ Architecture Overview

This application follows a modular Vue 3 + Quasar architecture with clear separation of concerns:

- **📊 Models** (`src/components/models.ts`) - Data structures and API contracts
- **🔌 Providers** - HTTP communication abstraction layer (planned)
- **⚡ Composables** - Reactive state management and reusable logic (planned)
- **🧩 Components** - UI components organized by feature

### Planned Navigation Structure

| Route         | Component        | Purpose                             |
| ------------- | ---------------- | ----------------------------------- |
| `/`           | AccessPage       | Landing page for access code entry  |
| `/view/:code` | DocumentViewPage | Document display and interaction    |
| `/*`          | NotFound         | Graceful handling of invalid routes |

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3 (Composition API + TypeScript)
- **UI Framework**: Quasar Framework v2.16+
- **Build Tool**: Vite (via @quasar/app-vite)
- **Internationalization**: Vue I18n (mandatory for all user-facing text)
- **HTTP Client**: Axios (configured in `src/boot/axios.ts`)
- **Deployment**: Docker + Kubernetes + Nginx

## 📋 Development Guidelines

### Mandatory Patterns

#### Quasar Usage Rules

- ✅ **Use**: Quasar grid system (`q-page`, `row`, `col`, `q-card`, `q-toolbar`)
- ❌ **Avoid**: Manual div-based grids, inline styles, custom CSS
- 🎯 **Prefer**: Horizontal row-based layouts over vertical stacking

#### Internationalization (i18n)

- 🌐 **Mandatory**: All user-facing text via Vue I18n
- 📝 **Pattern**: Semantic translation keys by context (`document.send.success`)
- 🗣️ **Languages**: English (default), French/German (planned)

#### TypeScript & Code Style

- 📜 **All components**: Use `<script setup lang="ts">`
- 🔧 **Build target**: ES2022 with strict TypeScript
- 📏 **Linting**: ESLint flat config + Prettier auto-formatting

### Commit Convention

```bash
type(scope): Description

# Examples:
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

## 🚢 Deployment

### Docker Build

Multi-stage build process:

1. **Build stage**: Node.js 20 Alpine → `npm run build`
2. **Serve stage**: Nginx Alpine → Serve static files

### Kubernetes Deployment

- **Namespace**: `oc-client`
- **Registry**: GitHub Container Registry (GHCR)
- **CI/CD**: GitHub Actions (`.github/workflows/cicd.yml`)
- **Auto-deploy**: On push to `main` branch

## 📚 Documentation

- **[KNOWLEDGE_BASE.md](./KNOWLEDGE_BASE.md)** - Complete architectural specifications, UX guidelines, and component responsibilities
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - AI coding agent guidance and project patterns

## 🔧 Configuration Files

- `quasar.config.ts` - Quasar framework configuration
- `src/boot/` - App initialization (axios, i18n)
- `src/router/routes.ts` - Vue Router configuration
- `k8s/` - Kubernetes deployment manifests

---

For detailed architectural information and development patterns, see [KNOWLEDGE_BASE.md](./KNOWLEDGE_BASE.md).
