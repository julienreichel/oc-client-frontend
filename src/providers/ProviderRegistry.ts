import type { DocumentProvider } from './DocumentProvider';
import { MockDocumentProvider } from './MockDocumentProvider';
import { HttpDocumentProvider } from './HttpDocumentProvider';

/**
 * Registry for document providers
 *
 * This module provides a central place to manage the active document provider.
 * By default, it uses the HttpDocumentProvider with same-origin /api endpoint.
 * Set VUE_APP_USE_MOCK_PROVIDER=true to use MockDocumentProvider instead.
 */

// Initialize the active provider based on environment
const getDefaultProvider = (): DocumentProvider => {
  // Use HTTP provider by default, unless explicitly set to use mock
  const useMockProvider = process.env.VUE_APP_USE_MOCK_PROVIDER === 'true';

  if (useMockProvider) {
    return configureProvider({ mode: 'development' });
  }

  // Default to HTTP provider with same-origin /api path
  const baseUrl = process.env.VUE_APP_API_BASE_URL ?? '/api';

  return configureProvider({
    mode: 'production',
    baseUrl,
  });
};

const activeProvider = getDefaultProvider();

/**
 * The currently active document provider instance
 *
 * Use this throughout the application to retrieve documents.
 * The implementation can be swapped without changing consumer code.
 */
export const documentProvider: DocumentProvider = activeProvider;

/**
 * Configuration options for the provider registry
 */
export interface ProviderConfig {
  /** Environment mode - determines which provider to use */
  mode: 'development' | 'production' | 'test';
  /** Base URL for HTTP providers (required for production mode) */
  baseUrl?: string;
  /** Optional timeout in milliseconds for provider operations */
  timeout?: number;
  /** Optional headers for HTTP providers */
  headers?: Record<string, string>;
}

/**
 * Sets up the document provider based on configuration
 */
export function configureProvider(config: ProviderConfig): DocumentProvider {
  switch (config.mode) {
    case 'development':
    case 'test':
      return new MockDocumentProvider();

    case 'production': {
      if (!config.baseUrl) {
        throw new Error('baseUrl is required for production mode with HTTP provider');
      }
      const httpConfig: { baseUrl: string; timeout?: number; headers?: Record<string, string> } = {
        baseUrl: config.baseUrl,
      };
      if (config.timeout !== undefined) {
        httpConfig.timeout = config.timeout;
      }
      if (config.headers !== undefined) {
        httpConfig.headers = config.headers;
      }
      return new HttpDocumentProvider(httpConfig);
    }

    default:
      return new MockDocumentProvider();
  }
}

/**
 * Gets the current provider configuration
 * Useful for debugging and testing
 */
export function getCurrentProvider(): DocumentProvider {
  return documentProvider;
}

/**
 * Type guard to check if a provider is the mock implementation
 * Useful for testing and conditional logic
 */
export function isMockProvider(provider: DocumentProvider): provider is MockDocumentProvider {
  return provider instanceof MockDocumentProvider;
}

/**
 * Type guard to check if a provider is the HTTP implementation
 * Useful for testing and conditional logic
 */
export function isHttpProvider(provider: DocumentProvider): provider is HttpDocumentProvider {
  return provider instanceof HttpDocumentProvider;
}
