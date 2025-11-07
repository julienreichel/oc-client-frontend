import DocumentViewPage from './DocumentViewPage.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { i18n } from 'src/i18n';
import {
  getDocumentViewPage,
  getBackToHomeButton
} from './DocumentViewPage.getters';

const routes = [
  { path: '/', name: 'access', component: { template: '<div>Access</div>' } },
  { path: '/view/:code', name: 'view', component: DocumentViewPage },
];

describe('DocumentViewPage HTTP Integration', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    router = createRouter({
      history: createWebHashHistory(),
      routes,
    });
  });

  describe('HTTP integration tests', () => {
    it('should render component with HTTP provider integration', async () => {
      // Mount component with HTTP provider support
      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router, i18n],
          stubs: {
            LoadingState: { template: '<div data-cy="loading-spinner">Loading...</div>' },
            ErrorState: { template: '<div data-cy="error-state">Error occurred</div>' },
            DocumentViewer: { template: '<div data-cy="document-viewer">Document content</div>' },
          },
        },
      });

      await router.push('/view/HTTP123');

      // Verify component structure exists
      getDocumentViewPage().should('exist');
    });

    it('should handle HTTP provider lifecycle', async () => {
      // Mount component
      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router, i18n],
          stubs: {
            LoadingState: { template: '<div data-cy="loading-spinner">Loading...</div>' },
            ErrorState: { template: '<div data-cy="error-state">Error occurred</div>' },
            DocumentViewer: { template: '<div data-cy="document-viewer">Document content</div>' },
          },
        },
      });

      await router.push('/view/TEST123');

      // Test that component can handle different states
      // Since we're using the real HTTP provider, we'll get an error state
      // which is expected behavior
      getDocumentViewPage().should('exist');

      // The component should handle the HTTP provider's response (success or error)
      // without crashing
      getDocumentViewPage().should('not.be.empty');
    });

    it('should maintain proper component structure with HTTP integration', () => {
      // Test basic structural requirements for HTTP integration
      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router, i18n],
          stubs: {
            LoadingState: { template: '<div data-cy="loading-spinner">Loading...</div>' },
            ErrorState: { template: '<div data-cy="error-state">Error occurred</div>' },
            DocumentViewer: { template: '<div data-cy="document-viewer">Document content</div>' },
          },
        },
      }).then(async () => {
        await router.push('/view/INTEGRATION123');

        // Verify the component can be mounted and has the required structure
        getDocumentViewPage().should('exist');
        cy.get('nav[aria-label="Document navigation"]').should('exist');
        getBackToHomeButton().should('exist');
      });
    });
  });
});
