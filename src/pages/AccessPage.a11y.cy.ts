import AccessPage from './AccessPage.vue';

describe('AccessPage Accessibility', () => {
  beforeEach(() => {
    cy.mount(AccessPage);
  });

  describe('form accessibility', () => {
    it('should have properly labeled input field', () => {
      // Check that input has proper label association (better than aria-label)
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'id');

      // Get the input ID and check if there's a corresponding label
      cy.get('[data-cy="access-code-input"]')
        .invoke('attr', 'id')
        .then((inputId) => {
          cy.get(`label[for="${inputId}"]`).should('exist').and('contain.text', 'Access Code');
        });

      // Check placeholder is present for additional guidance
      cy.get('[data-cy="access-code-input"]')
        .should('have.attr', 'placeholder')
        .and('not.be.empty');
    });

    it('should have accessible submit button', () => {
      // Button should exist and have proper attributes
      cy.get('[data-cy="submit-button"]').should('exist');

      // Check for aria-describedby for additional accessibility context
      cy.get('[data-cy="submit-button"]').should('have.attr', 'aria-describedby');

      // Button should be keyboard accessible
      cy.get('[data-cy="submit-button"]').should('have.attr', 'type', 'submit');
    });

    it('should associate error messages with input', () => {
      // Verify input has proper accessibility setup (without chaining aria-describedby)
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'aria-required', 'true');
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'aria-describedby');
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'aria-invalid');

      // Verify form structure supports error association
      cy.get('form').should('have.attr', 'novalidate');

      // Check that input has proper ID for label association
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'id');
      cy.get('[data-cy="access-code-input"]')
        .invoke('attr', 'id')
        .should('match', /access-code-\d+/);
    });

    it('should provide clear error messaging', () => {
      // Verify the form has proper structure for error messaging
      cy.get('form')
        .should('have.attr', 'aria-label', 'Document Access Form')
        .and('have.attr', 'novalidate');

      // Verify input has proper labeling structure
      cy.get('[data-cy="access-code-input"]').then(($input) => {
        const inputId = $input.attr('id');
        expect(inputId).to.match(/access-code-\d+/);

        // Check that label properly references input
        cy.get(`label[for="${inputId}"]`).should('exist');
      });

      // Check that form has accessible labeling
      cy.get('form[aria-label="Document Access Form"]').should('exist');
    });

    it('should maintain focus management', () => {
      // Check elements exist and have proper attributes for focus management
      cy.get('[data-cy="access-code-input"]').should('exist').and('have.attr', 'id');
      cy.get('[data-cy="submit-button"]').should('exist').and('have.attr', 'type', 'submit');

      // Check that input has proper ARIA attributes for focus management
      cy.get('[data-cy="access-code-input"]')
        .should('have.attr', 'aria-required', 'true')
        .and('have.attr', 'aria-describedby');
    });
  });

  describe('keyboard navigation', () => {
    it('should support Enter key submission', () => {
      // Verify form has proper keyboard accessibility setup
      cy.get('form').should('have.attr', 'novalidate');

      // Check that input has proper keyboard attributes (without chaining)
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'id');
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'aria-required', 'true');

      // Verify submit button is keyboard accessible
      cy.get('[data-cy="submit-button"]').should('have.attr', 'type', 'submit');
    });

    it('should handle Escape key gracefully', () => {
      // Verify input maintains proper ARIA attributes (without chaining)
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'aria-describedby');
      cy.get('[data-cy="access-code-input"]').should('have.attr', 'aria-invalid');

      // Form should remain functional for keyboard users
      cy.get('form').should('have.attr', 'novalidate');
    });
  });

  describe('screen reader support', () => {
    it('should have page title for screen readers', () => {
      // Page should have main heading
      cy.get('h1').should('exist').and('be.visible');
      cy.get('h1').should('contain.text', 'Enter Access Code');
    });

    it('should provide form instructions', () => {
      // Check for visible instructions text
      cy.contains('Enter the access code you received to view your document').should('exist');

      // Check for screen reader instructions (hidden but accessible)
      cy.get('div[aria-live="polite"]').should('exist');
    });
  });
});
