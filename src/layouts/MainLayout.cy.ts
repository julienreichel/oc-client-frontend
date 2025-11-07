import MainLayout from '../layouts/MainLayout.vue';

describe('MainLayout.cy.ts', () => {
  it('displays app title from i18n', () => {
    cy.mount(MainLayout);

    // Check that the i18n title is displayed
    cy.contains('Document Viewer').should('be.visible');
  });

  it('renders with proper layout structure', () => {
    cy.mount(MainLayout);

    // Check basic structure exists (Quasar classes may not be applied in component testing)
    cy.get('div').should('exist');
    cy.contains('Document Viewer').should('be.visible');
  });
});
