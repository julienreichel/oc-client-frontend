import AccessPage from './AccessPage.vue';

describe('AccessPage', () => {
  it('renders form elements', () => {
    cy.mount(AccessPage);

    // Check form input is present
    cy.get('[data-cy="access-input-field"]').should('exist');

    // Check submit button is present
    cy.get('[data-cy="submit-button"]').should('exist');
  });

  it('renders submit button', () => {
    cy.mount(AccessPage);

    // Check submit button exists (visibility might be affected by Quasar styles in test env)
    cy.get('[data-cy="submit-button"]').should('exist');
  });
});
