export default {
  // Application
  app: {
    title: 'Document Viewer',
  },

  // Common actions
  failed: 'Action failed',
  success: 'Action was successful',

  // Layout
  layout: {
    title: 'Client Portal',
  },

  // Access page
  access: {
    title: 'Enter Access Code',
    label: 'Access Code',
    placeholder: 'Enter your access code',
    submit: 'View Document',
    validation: {
      required: 'Access code is required',
    },
  },

  // Document viewing
  document: {
    loading: 'Loading document...',
    error: {
      notFound: 'Document not found. Please check your access code.',
      expired: 'This document has expired and is no longer available.',
      unavailable: 'Document is currently unavailable. Please try again later.',
    },
    retry: 'Try Again',
    createdAt: 'Created on {date}',
  },

  // 404 Not Found page
  notFound: {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    ctaHome: 'Return Home',
  },
};
