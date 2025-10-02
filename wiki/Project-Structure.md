# Project Structure

This document explains the organization and structure of the Cypress automation framework.

## Directory Structure

```
project-root/
├── cypress/
│   ├── e2e/                 # Test files
│   │   ├── login.cy.js
│   │   └── register.cy.js
│   ├── fixtures/           # Test data
│   │   └── example.json
│   ├── support/           # Support files
│   │   ├── commands.js    # Custom commands
│   │   └── e2e.js        # Global configuration
│   └── reports/          # Test reports
│       └── coverage/     # Code coverage reports
├── .github/
│   └── workflows/        # GitHub Actions workflows
├── cypress.config.js     # Cypress configuration
└── package.json         # Project dependencies
```

## Key Components

### Test Files (e2e/)

- Test files use the `.cy.js` extension
- Each file focuses on a specific feature
- Files are organized by functionality

Example:
```javascript
// login.cy.js
describe('Login Feature', () => {
  it('should login successfully', () => {
    // test code
  });
});
```

### Support Files (support/)

#### commands.js
Custom commands that extend Cypress functionality:
```javascript
Cypress.Commands.add('login', (email, password) => {
  // login implementation
});
```

#### e2e.js
Global configuration and imports:
```javascript
import './commands';
// Other global imports and configuration
```

### Configuration (cypress.config.js)

Main configuration file:
```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://your-app.com',
    defaultCommandTimeout: 10000,
    // other configurations
  },
});
```

### GitHub Actions Workflow

CI/CD configuration:
```yaml
name: Cypress Tests
on: 
  schedule:
    - cron: '0 */3 * * *'
  push:
    branches: [ main ]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      # Additional steps...
```