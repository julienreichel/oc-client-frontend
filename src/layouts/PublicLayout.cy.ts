import PublicLayout from './PublicLayout.vue';

describe('PublicLayout.cy.ts', () => {
  it('renders slot content in the main area', () => {
    const slotContent = '<div data-cy="test-content">Test slot content</div>';

    cy.mount(PublicLayout, {
      slots: {
        default: slotContent,
      },
    });

    // Check that slot content is rendered
    cy.dataCy('test-content').should('be.visible');
    cy.contains('Test slot content').should('be.visible');
  });

  it('renders layout structure', () => {
    cy.mount(PublicLayout);

    // Check basic structure exists (focus on semantic elements)
    cy.get('div').should('exist');
    cy.get('main[role="main"]').should('exist');
  });

  it('has accessible main content area', () => {
    cy.mount(PublicLayout);

    // Check accessibility features that work in component testing
    cy.get('main[role="main"]').should('exist');
  });
});
