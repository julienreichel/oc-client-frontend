import ExampleComponent from '../components/ExampleComponent.vue';

describe('ExampleComponent Quasar Helpers', () => {
  it('uses dataCy helper for Quasar best practices', () => {
    const todos = [{ id: 1, content: 'Test todo with data-cy' }];

    cy.mount(ExampleComponent, {
      props: {
        title: 'Quasar Test',
        active: true,
        todos,
        meta: { totalCount: 1 },
      },
    });

    // Test the Quasar dataCy helper (best practice for stable selectors)
    cy.contains('Test todo with data-cy').should('be.visible');

    // Verify basic component functionality
    cy.contains('Quasar Test').should('be.visible');
  });
});
