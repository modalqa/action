# Test Writing Guidelines

This document provides guidelines and best practices for writing tests using our Cypress framework.

## Test Structure

### Basic Test Template

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code that runs before each test
    cy.visit('/feature-path');
  });

  it('should perform specific action', () => {
    // Test implementation
  });

  afterEach(() => {
    // Cleanup code if needed
  });
});
```

## Best Practices

### 1. Selector Strategy

Prefer selectors in this order:
1. Data attributes (`data-testid`)
2. Semantic HTML (`button`, `input[type="submit"]`)
3. Class names (if stable)
4. IDs (if available)

Example:
```javascript
// Good
cy.get('[data-testid="login-button"]')
cy.get('button[type="submit"]')

// Avoid
cy.get('.btn-blue')
cy.get('#submit-btn')
```

### 2. Waiting Strategy

Use proper waiting techniques:
```javascript
// Good - Wait for element to be visible
cy.get('button').should('be.visible')

// Good - Wait for network request
cy.intercept('POST', '/api/login').as('loginRequest')
cy.wait('@loginRequest')

// Avoid
cy.wait(5000) // arbitrary time delays
```

### 3. Assertions

Write meaningful assertions:
```javascript
// Good
cy.get('.error-message')
  .should('be.visible')
  .and('contain', 'Invalid credentials')

// Better - Multiple assertions
cy.get('.user-profile').should(($el) => {
  expect($el).to.be.visible
  expect($el.text()).to.include('Welcome')
})
```

### 4. API Testing

Handle API interactions:
```javascript
cy.intercept('POST', '/api/register', (req) => {
  expect(req.body).to.have.property('email')
  req.reply({
    statusCode: 200,
    body: { message: 'Success' }
  })
})
```

### 5. Custom Commands

Create custom commands for repeated actions:
```javascript
// In commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[name="email"]').type(email)
  cy.get('[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

// In test file
cy.login('user@example.com', 'password123')
```

## Test Data Management

### Using Fixtures

```javascript
describe('User Registration', () => {
  let testData;

  before(() => {
    cy.fixture('user-data.json').then((data) => {
      testData = data;
    });
  });

  it('should register new user', () => {
    cy.get('[name="email"]').type(testData.email);
    // ... more test steps
  });
});
```

## Error Handling

Handle potential errors gracefully:
```javascript
cy.get('form').within(() => {
  cy.get('button[type="submit"]')
    .click()
    .should(() => {
      // Custom error handling
      try {
        // your assertions
      } catch (err) {
        throw new Error(`Failed to submit form: ${err.message}`);
      }
    });
});
```

## Documentation

Add proper comments and documentation:
```javascript
/**
 * Tests the user registration flow
 * Prerequisites:
 * - Application is running
 * - Database is clean
 * 
 * @example
 * describe('Registration', () => {
 *   it('should register new user', () => {
 *     // test implementation
 *   });
 * });
 */
```