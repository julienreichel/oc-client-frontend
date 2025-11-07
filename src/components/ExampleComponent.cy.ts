import ExampleComponent from '../components/ExampleComponent.vue';

describe('ExampleComponent.cy.ts', () => {
  it('mounts ExampleComponent', () => {
    const todos = [
      { id: 1, content: 'Test todo 1' },
      { id: 2, content: 'Test todo 2' },
    ];

    const meta = { totalCount: 2 };

    cy.mount(ExampleComponent, {
      props: {
        title: 'Test Component',
        active: true,
        todos,
        meta,
      },
    });

    // Check that the component renders
    cy.contains('Test Component').should('be.visible');
    cy.contains('Test todo 1').should('be.visible');
    cy.contains('Test todo 2').should('be.visible');
  });

  it('handles click interaction', () => {
    // Add todos for interaction
    const todos = [{ id: 1, content: 'Clickable todo' }];

    cy.mount(ExampleComponent, {
      props: {
        title: 'Interactive Test',
        active: true,
        todos,
        meta: { totalCount: 1 },
      },
    });

    // Initial click count should be 0
    cy.contains('Clicks on todos: 0').should('be.visible');

    // Click on the todo item to increment
    cy.get('li').contains('Clickable todo').click();
    cy.contains('Clicks on todos: 1').should('be.visible');

    // Click again
    cy.get('li').contains('Clickable todo').click();
    cy.contains('Clicks on todos: 2').should('be.visible');
  });
});
