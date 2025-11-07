// Import commands.ts using ES2015 syntax:
import './commands';

// Import global styles if any
import '../../src/css/app.scss';

import { mount } from '@cypress/vue';

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
