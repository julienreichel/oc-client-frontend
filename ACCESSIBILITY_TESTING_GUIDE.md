# Accessibility-First Cypress Testing Guide

## 🎯 Overview

This guide establishes a comprehensive accessibility-first Cypress testing strategy that aligns tests with screen reader behavior and ensures maintainable, semantic test selectors. This approach creates tests that validate the same user experience that assistive technologies provide.

## 🏗️ Architecture Summary

### Core Principles

1. **Getter Utility Pattern**: Each component has a corresponding `.getters.ts` file with semantic element selectors
2. **Aria-Label Based Selection**: Tests use `aria-label` attributes instead of `data-cy` or CSS selectors
3. **Internationalized Accessibility**: All aria-labels come from i18n translations in dedicated `a11y` section
4. **Structured Object Pattern**: Getters are organized in const objects with TypeScript support
5. **Minimal Abstraction**: Only create getters for elements that actually exist in components

### Benefits

- **Accessibility Alignment**: Tests match assistive technology behavior
- **Maintainability**: Changes to aria-labels only require getter updates
- **Semantic Testing**: Focus on user experience rather than implementation
- **Type Safety**: Full TypeScript support with IntelliSense
- **Internationalization**: Built-in support for multiple languages
- **Consistency**: Standardized testing approach across entire codebase

---

## 📋 Implementation Guide

### 1. Getter Utility Architecture

#### File Structure

- **Location**: Create `{ComponentName}.getters.ts` files alongside each component
- **Pattern**: Use structured object exports with TypeScript support
- **Naming**: Follow `{ComponentName}Getters` convention

#### Template Structure

```typescript
/**
 * Cypress component test getter utilities for {ComponentName}
 *
 * Provides semantic, accessibility-first element getters using aria-label selectors.
 * Follows minimal abstraction pattern with only getters for elements that exist.
 *
 * @see https://docs.cypress.io/guides/component-testing/introduction
 * @see https://testing-library.com/docs/queries/byrole/
 */

/// <reference types="cypress" />

// Base utility for aria-label based selection
const getByAriaLabel = (label: string): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get(`[aria-label="${label}"]`);

/**
 * {ComponentName} component getters
 * Uses aria-label selectors for accessibility-first testing approach
 */
export const {ComponentName}Getters = {
  /**
   * Element description
   */
  getElementName: () => getByAriaLabel('translation key value'),

  /**
   * Submit button
   */
  getSubmitButton: () => getByAriaLabel('Submit form'),

  /**
   * Error message display
   */
  getErrorMessage: () => getByAriaLabel('Error message'),

  // Add more getters as needed...
} as const;

/**
 * Type definitions for getter return values
 */
export type {ComponentName}Elements = {
  [K in keyof typeof {ComponentName}Getters]: ReturnType<(typeof {ComponentName}Getters)[K]>;
};
```

### 2. Accessibility-First Selectors

#### Selector Strategy Rules

```typescript
// ✅ PREFERRED: Semantic aria-label selection
ComponentGetters.getSubmitButton(); // → cy.get('[aria-label="Submit form"]')

// ✅ ACCEPTABLE: Dynamic accessibility relationships
cy.get(`label[for="${inputId}"]`); // Testing label association

// ✅ ACCEPTABLE: ARIA structural testing
cy.get('div[aria-live="polite"]'); // Testing live regions

// ✅ ACCEPTABLE: Semantic content testing
cy.contains('Enter the access code'); // Testing visible instruction text

// ❌ FORBIDDEN: Implementation-specific selectors
cy.get('[data-cy="submit-btn"]'); // Avoid data-cy attributes
cy.get('.btn-primary'); // Avoid CSS class selectors
cy.get('#submit-button'); // Avoid ID selectors
```

#### Exception Cases

The following `cy.get()` patterns are acceptable when they test accessibility relationships:

1. **Dynamic Label Association**: `cy.get(`label[for="${inputId}"]`)`
2. **ARIA Live Regions**: `cy.get('div[aria-live="polite"]')`
3. **Role-Based Selection**: `cy.get('[role="alert"]')`
4. **Focus Management**: `cy.get(':focus')` for testing focus state

### 3. Internationalization Integration

#### Translation Structure

Create a dedicated `a11y` section in your translation files:

```typescript
export default {
  // ... other translations (form, navigation, content, etc.)

  // Accessibility labels and instructions
  a11y: {
    // Global accessibility labels
    skipToMain: 'Skip to main content',
    loading: 'Loading...',
    errorRegion: 'Error message',

    // Component-specific accessibility labels
    documentTitle: 'Document title',
    documentContent: 'Document content',
    documentMetadata: 'Document metadata',

    // Form accessibility labels
    submitButton: 'Submit form',
    inputField: 'Input field',
    errorMessage: 'Error message',

    // Navigation accessibility labels
    backButton: 'Go back',
    homeButton: 'Go to home',
    menuButton: 'Open menu',
  },

  // ... other sections
};
```

#### Translation Guidelines

- **Case Convention**: Use sentence case (lowercase first letter) for consistency
- **Descriptive Labels**: Make aria-labels descriptive but concise
- **Context Awareness**: Include context in labels when needed (e.g., "Submit access code" vs "Submit")
- **Consistency**: Ensure aria-label values match getter expectations exactly

### 4. Component Implementation

#### Vue Component Template

```vue
<template>
  <div :aria-label="$t('a11y.componentName')" class="component-wrapper">
    <!-- Page title with accessibility label -->
    <h1 :aria-label="$t('a11y.pageTitle')">
      {{ $t('page.title') }}
    </h1>

    <!-- Form with proper accessibility -->
    <form :aria-label="$t('a11y.formName')" @submit.prevent="handleSubmit">
      <!-- Input with internationalized aria-label -->
      <input
        :aria-label="$t('a11y.inputField')"
        :placeholder="$t('form.placeholder')"
        v-model="inputValue"
        aria-required="true"
      />

      <!-- Submit button with accessibility -->
      <button type="submit" :aria-label="$t('a11y.submitButton')">
        {{ $t('form.submit') }}
      </button>
    </form>

    <!-- Error message with proper ARIA -->
    <div v-if="hasError" :aria-label="$t('a11y.errorMessage')" role="alert" aria-live="assertive">
      {{ errorText }}
    </div>

    <!-- Loading state with accessibility -->
    <div v-if="isLoading" :aria-label="$t('a11y.loadingSpinner')" role="status" aria-live="polite">
      {{ $t('a11y.loading') }}
    </div>
  </div>
</template>
```

#### Key Requirements

- **Mandatory**: All interactive elements must have internationalized `aria-label` attributes
- **Pattern**: Use `$t('a11y.key')` for all aria-label values
- **Consistency**: Ensure component aria-labels match getter utility expectations
- **Semantic HTML**: Use proper semantic elements (`button`, `form`, headings)
- **ARIA Attributes**: Include `role`, `aria-live`, `aria-required` where appropriate

### 5. Test Implementation

#### Basic Component Test Structure

```typescript
import ComponentName from './ComponentName.vue';
import { ComponentNameGetters } from './ComponentName.getters';
import { ChildComponentGetters } from '../child/ChildComponent.getters';

describe('ComponentName', () => {
  beforeEach(() => {
    cy.mount(ComponentName, {
      props: {
        // Add required props
      },
    });
  });

  it('should render basic structure', () => {
    // Use getter utilities for all element selection
    ComponentNameGetters.getContainer().should('exist');
    ComponentNameGetters.getTitle().should('be.visible');
  });

  it('should handle form submission', () => {
    // Test user interactions using getters
    ComponentNameGetters.getInputField().type('test input');
    ComponentNameGetters.getSubmitButton().click();

    // Verify results using semantic selectors
    ComponentNameGetters.getSuccessMessage().should('be.visible');
  });

  it('should display error states', () => {
    // Test error handling
    ComponentNameGetters.getInputField().type('invalid input');
    ComponentNameGetters.getSubmitButton().click();

    ComponentNameGetters.getErrorMessage().should('be.visible');
    ComponentNameGetters.getErrorMessage().should('contain.text', 'Error occurred');
  });
});
```

#### Accessibility-Specific Testing

Create dedicated `.a11y.cy.ts` files for comprehensive accessibility testing:

```typescript
import ComponentName from './ComponentName.vue';
import { ComponentNameGetters } from './ComponentName.getters';

describe('ComponentName Accessibility', () => {
  beforeEach(() => {
    cy.mount(ComponentName);
  });

  describe('form accessibility', () => {
    it('should have properly labeled elements', () => {
      // Verify aria-label attributes
      ComponentNameGetters.getInputField().should('have.attr', 'aria-label', 'Input field');
      ComponentNameGetters.getSubmitButton().should('have.attr', 'aria-label', 'Submit form');
    });

    it('should associate error messages with inputs', () => {
      // Test ARIA relationships
      ComponentNameGetters.getInputField().then(($input) => {
        const describedBy = $input.attr('aria-describedby');
        expect(describedBy).to.exist;

        cy.get(`#${describedBy}`).should('exist');
      });
    });
  });

  describe('keyboard navigation', () => {
    it('should support tab navigation', () => {
      ComponentNameGetters.getInputField().focus();
      ComponentNameGetters.getInputField().should('have.focus');

      ComponentNameGetters.getInputField().tab();
      ComponentNameGetters.getSubmitButton().should('have.focus');
    });
  });

  describe('screen reader support', () => {
    it('should have proper ARIA live regions', () => {
      cy.get('[aria-live="polite"]').should('exist');
      cy.get('[role="status"]').should('exist');
    });

    it('should announce loading states', () => {
      ComponentNameGetters.getLoadingSpinner().should('have.attr', 'aria-live', 'polite');
    });
  });
});
```

### 6. Testing Categories

#### Form Accessibility Tests

- Label associations (`label[for="id"]`)
- ARIA attributes (`aria-required`, `aria-invalid`)
- Error message associations (`aria-describedby`)
- Validation feedback

#### Keyboard Navigation Tests

- Tab order and focus management
- Enter key submission
- Escape key handling
- Focus trapping in modals

#### Screen Reader Support Tests

- ARIA live regions (`aria-live="polite"`)
- Role attributes (`role="alert"`, `role="status"`)
- Landmark navigation (`main`, `nav`, `aside`)
- Skip links for keyboard users

#### Focus Management Tests

- Focus placement after navigation
- Focus restoration after modals
- Visual focus indicators
- Focus trapping

---

## ✅ Implementation Checklist

### Per Component

- [ ] Create `{Component}.getters.ts` with structured object pattern
- [ ] Add comprehensive JSDoc documentation
- [ ] Include TypeScript type definitions
- [ ] Test all getters correspond to actual component elements
- [ ] Add internationalized `aria-label` attributes to all interactive elements

### Per Test File

- [ ] Replace all `data-cy` selectors with getter utilities
- [ ] Import appropriate getter files for component dependencies
- [ ] Use semantic assertions (`have.attr`, `contain.text`)
- [ ] Create dedicated `.a11y.cy.ts` for accessibility-specific tests
- [ ] Test keyboard navigation and focus management

### Internationalization

- [ ] Add `a11y` section to translation files
- [ ] Use sentence case for all accessibility labels
- [ ] Ensure aria-label translations match component implementation
- [ ] Verify getter utilities use correct translation values

### Quality Assurance

- [ ] All tests pass using only getter utilities
- [ ] Zero usage of `data-cy` or CSS selectors in component tests
- [ ] Components have proper aria-label attributes
- [ ] Screen reader compatibility verified through semantic testing
- [ ] Accessibility tests cover keyboard navigation, focus management, and ARIA

---

## 🔍 Examples and Patterns

### Example Getter File

```typescript
export const AccessPageGetters = {
  /**
   * Main page container
   */
  getPage: () => getByAriaLabel('Document access page'),

  /**
   * Page title/heading
   */
  getTitle: () => getByAriaLabel('Enter access code'),

  /**
   * Access code form
   */
  getForm: () => getByAriaLabel('Document access form'),

  /**
   * Submit button for access code
   */
  getSubmitButton: () => getByAriaLabel('Submit access code'),
} as const;
```

### Example Test Usage

```typescript
describe('AccessPage', () => {
  it('renders form elements', () => {
    AccessPageGetters.getForm().should('exist');
    AccessPageGetters.getSubmitButton().should('be.visible');
  });

  it('should have accessible form structure', () => {
    AccessPageGetters.getForm().should('have.attr', 'novalidate');
    AccessPageGetters.getSubmitButton().should('have.attr', 'type', 'submit');
  });
});
```

### Cross-Component Testing

```typescript
import { AccessPageGetters } from './AccessPage.getters';
import { AccessInputGetters } from '../components/AccessInput.getters';

describe('AccessPage with AccessInput', () => {
  it('should handle nested component interaction', () => {
    // Test parent page elements
    AccessPageGetters.getForm().should('exist');

    // Test nested child component elements
    AccessInputGetters.getInputField().type('test123');
    AccessPageGetters.getSubmitButton().click();
  });
});
```

---

## 🚀 Quick Start

1. **Set up getter utilities**: Create `.getters.ts` files for your components
2. **Add accessibility labels**: Implement `aria-label` attributes using i18n
3. **Update translations**: Add `a11y` section to your translation files
4. **Migrate tests**: Replace `data-cy` selectors with getter utilities
5. **Add accessibility tests**: Create `.a11y.cy.ts` files for comprehensive testing
6. **Validate**: Run tests and ensure 100% pass rate with new approach

This approach creates a robust, accessibility-focused testing infrastructure that ensures both functional correctness and inclusive user experience while providing maintainable and semantic test code.
