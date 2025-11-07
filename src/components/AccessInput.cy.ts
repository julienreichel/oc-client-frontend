import AccessInput from './AccessInput.vue';

describe('AccessInput', () => {
  it('renders label and placeholder correctly', () => {
    const props = {
      modelValue: '',
      label: 'Access Code',
      placeholder: 'Enter your access code',
      showError: false,
      errorMessage: '',
    };

    cy.mount(AccessInput, { props });

    // Check label is rendered
    cy.get('[data-cy="access-input-label"]').should('contain.text', 'Access Code');

    // Check input has correct placeholder
    cy.get('[data-cy="access-input-field"]').should(
      'have.attr',
      'placeholder',
      'Enter your access code',
    );
  });

  it('shows validation error when showError is true', () => {
    const props = {
      modelValue: '',
      label: 'Access Code',
      placeholder: 'Enter your access code',
      showError: true,
      errorMessage: 'Access code is required',
    };

    cy.mount(AccessInput, { props });

    // Check error message is displayed
    cy.get('[data-cy="access-input-error"]').should('be.visible');
    cy.get('[data-cy="access-input-error"]').should('contain.text', 'Access code is required');
  });

  it('hides validation error when showError is false', () => {
    const props = {
      modelValue: 'test',
      label: 'Access Code',
      placeholder: 'Enter your access code',
      showError: false,
      errorMessage: '',
    };

    cy.mount(AccessInput, { props });

    // Check error message is not displayed
    cy.get('[data-cy="access-input-error"]').should('not.exist');
  });

  it('renders with correct model value attribute', () => {
    const props = {
      modelValue: 'TEST123',
      label: 'Access Code',
      placeholder: 'Enter your access code',
      showError: false,
      errorMessage: '',
    };

    cy.mount(AccessInput, { props });

    // Verify the component has the model-value attribute set
    cy.get('[data-cy="access-input-field"]').should('have.attr', 'model-value', 'TEST123');
  });
});
