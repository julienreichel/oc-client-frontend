import DocumentViewPage from './DocumentViewPage.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { vi } from 'vitest';

// Mock the HTTP provider and registry
const mockHttpProvider = {
  getByCode: vi.fn(),
};

vi.mock('../providers/ProviderRegistry', () => ({
  documentProvider: mockHttpProvider,
}));

vi.mock('../providers/HttpClient', () => ({
  HttpClient: class {
    constructor() {}
    get = vi.fn();
  },
  HttpError: class extends Error {
    constructor(
      public status: number,
      public statusText: string,
      message?: string,
    ) {
      super(message ?? `HTTP ${status}: ${statusText}`);
      this.name = 'HttpError';
    }
  },
}));

const routes = [{ path: '/view/:code', component: DocumentViewPage }];

describe('DocumentViewPage with HttpDocumentProvider', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    router = createRouter({
      history: createWebHashHistory(),
      routes,
    });
  });

  describe('successful document loading', () => {
    beforeEach(async () => {
      // Mock successful document response
      mockHttpProvider.getByCode.mockResolvedValue({
        id: 'doc123',
        title: 'HTTP Test Document',
        content: 'This document was loaded via HTTP provider',
        createdAt: '2023-01-01T00:00:00Z',
      });

      // Mount component and navigate
      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router],
        },
      });

      await router.push('/view/HTTP123');
    });

    it('should load document successfully', () => {
      // Wait for loading to complete and check document is displayed
      cy.get('[data-cy="document-viewer"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="document-title"]').should('contain.text', 'HTTP Test Document');
      cy.get('[data-cy="document-content"]').should(
        'contain.text',
        'This document was loaded via HTTP provider',
      );
    });

    it('should call HTTP provider with correct access code', () => {
      cy.then(() => {
        expect(mockHttpProvider.getByCode).to.have.been.calledWith('HTTP123');
      });
    });
  });

  describe('error handling', () => {
    it('should show error state when document not found', async () => {
      // Mock ApiErrorException for NOT_FOUND
      const notFoundError = {
        name: 'ApiErrorException',
        code: 'NOT_FOUND',
        message: 'Document not found for the provided access code',
      };
      mockHttpProvider.getByCode.mockRejectedValue(notFoundError);

      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router],
        },
      });

      await router.push('/view/NOTFOUND');

      // Check error state is displayed
      cy.get('[data-cy="error-state"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="error-message"]').should('contain.text', 'Document not found');
    });

    it('should show error state when document expired', async () => {
      const expiredError = {
        name: 'ApiErrorException',
        code: 'EXPIRED',
        message: 'Document has expired and is no longer accessible',
      };
      mockHttpProvider.getByCode.mockRejectedValue(expiredError);

      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router],
        },
      });

      await router.push('/view/EXPIRED');

      cy.get('[data-cy="error-state"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="error-message"]').should('contain.text', 'expired');
    });

    it('should show error state when service unavailable', async () => {
      const unavailableError = {
        name: 'ApiErrorException',
        code: 'UNAVAILABLE',
        message: 'Service temporarily unavailable. Please try again later.',
      };
      mockHttpProvider.getByCode.mockRejectedValue(unavailableError);

      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router],
        },
      });

      await router.push('/view/TEST123');

      cy.get('[data-cy="error-state"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="error-message"]').should('contain.text', 'Service temporarily unavailable');
    });
  });

  describe('loading state', () => {
    it('should show loading state while fetching document', async () => {
      // Mock a delayed response to catch loading state
      let resolvePromise: (value: unknown) => void;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockHttpProvider.getByCode.mockReturnValue(delayedPromise);

      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router],
        },
      });

      await router.push('/view/DELAYED');

      // Check loading state is shown
      cy.get('[data-cy="loading-spinner"]').should('be.visible');

      // Resolve the promise to complete loading
      cy.then(() => {
        resolvePromise!({
          id: 'delayed-doc',
          title: 'Delayed Document',
          content: 'This took a while to load',
          createdAt: '2023-01-01T00:00:00Z',
        });
      });

      // Wait for document to appear
      cy.get('[data-cy="document-viewer"]', { timeout: 5000 }).should('be.visible');
    });
  });

  describe('retry functionality', () => {
    it('should retry loading document when retry button clicked', async () => {
      // First call fails
      mockHttpProvider.getByCode.mockRejectedValueOnce({
        name: 'ApiErrorException',
        code: 'UNAVAILABLE',
        message: 'Service temporarily unavailable',
      });

      // Second call succeeds
      mockHttpProvider.getByCode.mockResolvedValueOnce({
        id: 'retry-doc',
        title: 'Retry Success Document',
        content: 'This loaded after retry',
        createdAt: '2023-01-01T00:00:00Z',
      });

      cy.mount(DocumentViewPage, {
        global: {
          plugins: [router],
        },
      });

      await router.push('/view/RETRY123');

      // Wait for error state
      cy.get('[data-cy="error-state"]', { timeout: 5000 }).should('be.visible');

      // Click retry button
      cy.get('[data-cy="retry-button"]').click();

      // Wait for successful document load
      cy.get('[data-cy="document-viewer"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy="document-title"]').should('contain.text', 'Retry Success Document');

      // Verify provider was called twice
      cy.then(() => {
        expect(mockHttpProvider.getByCode).to.have.callCount(2);
      });
    });
  });
});
