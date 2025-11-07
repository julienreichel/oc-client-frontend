import type { DocumentProvider } from './DocumentProvider';
import { MockDocumentProvider } from './MockDocumentProvider';

/**
 * Registry for document providers
 *
 * This module provides a central place to manage the active document provider.
 * For now, it uses the MockDocumentProvider, but can be easily switched to
 * an HTTP-based provider or other implementations in the future.
 */

// Initialize the active provider
// In development/testing, we use the mock provider
// In production, this would be replaced with an HTTP provider
const activeProvider = new MockDocumentProvider();

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
  /** Optional base URL for HTTP providers */
  baseUrl?: string;
  /** Optional timeout in milliseconds for provider operations */
  timeout?: number;
}

/**
 * Sets up the document provider based on configuration
 * This function is reserved for future use when HTTP providers are implemented
 */
export function configureProvider(config: ProviderConfig): DocumentProvider {
  // For now, always return the mock provider
  // In the future, this will switch based on config.mode
  switch (config.mode) {
    case 'development':
    case 'test':
      return new MockDocumentProvider();

    case 'production':
      // TODO: Implement HTTP provider
      // return new HttpDocumentProvider(config.baseUrl, config.timeout);
      // For now, use mock provider in production as well
      return new MockDocumentProvider();

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
