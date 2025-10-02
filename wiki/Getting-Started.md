# Getting Started

This guide will help you set up and run the Cypress automation framework in your local environment.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/modalqa/action.git
cd action
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following content:
```
BASE_URL=https://your-application-url.com
```

## Running Tests

### Run all tests
```bash
npm run test
```

### Run specific test file
```bash
npm run test -- --spec "cypress/e2e/login.cy.js"
```

### Run tests in headed mode (with browser UI)
```bash
npm run test:headed
```

## Test Development

### Creating a new test file

1. Create a new file in `cypress/e2e/` with the naming convention `feature-name.cy.js`
2. Use the following template:

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/path-to-feature');
  });

  it('should do something', () => {
    // Your test code here
  });
});
```

### Best Practices

1. Use page objects when possible
2. Write descriptive test names
3. Keep tests independent
4. Use custom commands for repetitive actions
5. Add proper assertions
6. Handle asynchronous operations correctly

## Troubleshooting

Common issues and their solutions:

1. **Test timeouts**
   - Increase defaultCommandTimeout in cypress.config.js
   - Use proper wait strategies

2. **Network errors**
   - Check BASE_URL configuration
   - Verify network connectivity
   - Use proper interceptors for API calls

3. **Element not found**
   - Check selectors
   - Ensure proper wait times
   - Verify element visibility