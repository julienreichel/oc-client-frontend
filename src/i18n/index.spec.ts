import { describe, it, expect } from 'vitest';
import { i18n } from './index';

describe('i18n configuration', () => {
  it('should create i18n instance', () => {
    expect(i18n).toBeDefined();
    expect(i18n.global).toBeDefined();
  });

  it('should have correct locale configuration', () => {
    expect(i18n.global.locale).toBe('en');
    expect(i18n.global.fallbackLocale).toBe('en');
  });

  it('should resolve app.title translation key', () => {
    const translation = i18n.global.t('app.title');
    expect(translation).toBe('Document Viewer');
  });

  it('should resolve common.loading translation key', () => {
    const translation = i18n.global.t('common.loading');
    expect(translation).toBe('Loading...');
  });

  it('should resolve common.error.generic translation key', () => {
    const translation = i18n.global.t('common.error.generic');
    expect(translation).toBe('An error occurred. Please try again.');
  });

  it('should resolve common.retry translation key', () => {
    const translation = i18n.global.t('common.retry');
    expect(translation).toBe('Retry');
  });

  it('should handle fallback for missing keys', () => {
    const translation = i18n.global.t('nonexistent.key');
    expect(translation).toBe('nonexistent.key');
  });

  it('should have English messages loaded', () => {
    const messages = i18n.global.messages;
    expect(messages.en).toBeDefined();
    expect(messages.en.app).toBeDefined();
    expect(messages.en.common).toBeDefined();
  });
});
