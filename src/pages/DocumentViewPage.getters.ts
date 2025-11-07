/**
 * Minimal getter utilities for DocumentViewPage accessibility testing.
 * Only contains getters for elements that actually exist in the component.
 */

// Base utility function for aria-label selectors
export const getByAriaText = (text: string, options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  cy.get(`[aria-label="${text}"]`, options);

// Elements that exist in DocumentViewPage.vue
export const getDocumentViewPage = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Document view page', options);

export const getSkipToMainContent = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Skip to main content', options);

// Elements from DocumentViewer.vue component
export const getDocumentTitle = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Document title', options);

export const getDocumentMetadata = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Document metadata', options);

export const getDocumentContent = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Document content', options);

export const getEmptyDocumentState = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Empty document state', options);

// Elements from ErrorState.vue component  
export const getErrorMessage = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Error message', options);

export const getTryAgainButton = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Try Again', options);

// Elements from LoadingState.vue component
export const getLoadingMessage = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Loading message', options);

export const getLoadingSpinner = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Loading spinner', options);

// Navigation element from DocumentViewPage.vue (back-to-home button)
export const getEnterNewCodeButton = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getByAriaText('Enter New Code', options);

// Alias for the same element (back-to-home button has aria-label="Enter New Code")
export const getBackToHomeButton = (options?: { timeout?: number }): Cypress.Chainable<JQuery<HTMLElement>> =>
  getEnterNewCodeButton(options);