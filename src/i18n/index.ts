import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    app: {
      title: 'Document Viewer',
    },
    common: {
      loading: 'Loading...',
      retry: 'Retry',
      error: {
        generic: 'An error occurred. Please try again.',
      },
    },
  },
};

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default messages;
