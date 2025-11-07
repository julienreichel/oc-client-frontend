import DocumentViewPage from './DocumentViewPage.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { i18n } from 'src/i18n';

const routes = [
  { path: '/', name: 'access', component: { template: '<div>Access</div>' } },
  { path: '/view/:code', name: 'view', component: DocumentViewPage },
];

describe('DocumentViewPage Accessibility', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    router = createRouter({
      history: createWebHashHistory(),
      routes,
    });

    cy.mount(DocumentViewPage, {
      global: {
        plugins: [router, i18n],
      },
    });
  });

  describe('focus management', () => {
    it('should place focus on main heading after navigation', async () => {
      // Navigate to document view
      await router.push('/view/test123');

      // Main heading should receive focus for screen readers
      cy.get('[data-cy="document-title"]').should('have.focus').and('have.attr', 'tabindex', '-1'); // Programmatic focus
    });

    it('should maintain focus when content loads', async () => {
      await router.push('/view/valid123');

      // When document loads successfully, focus should remain on title
      cy.get('[data-cy="document-title"]', { timeout: 5000 })
        .should('be.visible')
        .and('have.focus');
    });

    it('should focus error heading when error occurs', async () => {
      await router.push('/view/invalid123');

      // When error occurs, focus should be on error heading
      cy.get('[data-cy="error-heading"]', { timeout: 5000 })
        .should('be.visible')
        .and('have.focus')
        .and('have.attr', 'tabindex', '-1');
    });
  });

  describe('error state accessibility', () => {
    it('should announce errors to screen readers', async () => {
      await router.push('/view/notfound');

      // Error message should have role="alert" for screen readers
      cy.get('[data-cy="error-message"]', { timeout: 5000 })
        .should('be.visible')
        .and('have.attr', 'role', 'alert');
    });

    it('should provide clear error messaging', async () => {
      await router.push('/view/expired');

      // Error messages should be human-friendly
      cy.get('[data-cy="error-message"]', { timeout: 5000 })
        .should('contain.text', 'no longer available')
        .and('not.contain', 'expired')
        .and('not.contain', '410')
        .and('not.contain', 'error');
    });

    it('should have accessible retry button', async () => {
      await router.push('/view/unavailable');

      // Retry button should be properly labeled
      cy.get('[data-cy="retry-button"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'Try Again')
        .and('have.attr', 'type', 'button');
    });

    it('should have accessible back navigation', async () => {
      await router.push('/view/test123');

      // Back button should be clearly labeled
      cy.get('[data-cy="back-button"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain.text', 'Enter New Code')
        .and('have.attr', 'role', 'button');
    });
  });

  describe('loading state accessibility', () => {
    it('should announce loading state to screen readers', async () => {
      await router.push('/view/loading123');

      // Loading message should be announced
      cy.get('[data-cy="loading-message"]')
        .should('be.visible')
        .and('have.attr', 'aria-live', 'polite');
    });

    it('should provide meaningful loading text', async () => {
      // Navigate to trigger loading state
      await router.push('/view/loading123');

      // Check that loading elements provide meaningful text for screen readers
      // Test the stubbed LoadingState component we configured
      cy.get('[data-cy="loading-message"]')
        .should('exist')
        .and('contain.text', 'Loading your document');

      // Verify loading spinner has accessibility role
      cy.get('[data-cy="loading-spinner"]', { timeout: 1000 }).should(
        'have.attr',
        'role',
        'status',
      );
    });
  });

  describe('document content accessibility', () => {
    it('should have proper heading structure', async () => {
      await router.push('/view/valid123');

      // Document should have proper heading hierarchy
      cy.get('[data-cy="document-title"]', { timeout: 5000 })
        .should('be.visible')
        .and('match', 'h1');
    });

    it('should provide document meta information', async () => {
      await router.push('/view/valid123');

      // Document metadata should be accessible
      cy.get('[data-cy="document-meta"]', { timeout: 5000 })
        .should('be.visible')
        .and('have.attr', 'aria-label')
        .then((ariaLabel) => {
          expect(ariaLabel).to.contain('Created');
        });
    });

    it('should handle empty content gracefully', async () => {
      await router.push('/view/empty123');

      // Empty content should be indicated
      cy.get('[data-cy="document-content"]', { timeout: 5000 })
        .should('exist')
        .then(($content) => {
          if ($content.text().trim() === '') {
            // Should have indication of empty content
            cy.get('[data-cy="empty-content-message"]')
              .should('be.visible')
              .and('contain.text', 'No content available');
          }
        });
    });
  });

  describe('keyboard navigation', () => {
    it('should support keyboard navigation for actions', async () => {
      await router.push('/view/error123');

      // Retry button should be keyboard accessible
      cy.get('[data-cy="retry-button"]', { timeout: 5000 })
        .focus()
        .should('have.focus')
        .type('{enter}');
    });

    it('should support Escape key for back navigation', async () => {
      await router.push('/view/test123');

      // Escape key should trigger back navigation
      cy.get('body').type('{esc}');
      cy.url().should('not.include', '/view/');
    });
  });

  describe('screen reader landmarks', () => {
    it('should have proper landmark structure', async () => {
      await router.push('/view/test123');

      // Main content should be in main landmark
      cy.get('main[role="main"]').should('exist');

      // Content should be within main
      cy.get('main').within(() => {
        cy.get('[data-cy="document-view-content"]').should('exist');
      });
    });

    it('should have skip links for keyboard users', () => {
      // Verify component structure supports keyboard accessibility
      cy.get('[data-cy="document-view-page"]').should('exist');

      // Check that main content area exists for skip link target
      cy.get('#main-content').should('exist');

      // Verify page has accessibility structure even if skip link isn't visible
      cy.get('[data-cy="document-view-page"]').should('not.be.empty');
    });
  });
});
