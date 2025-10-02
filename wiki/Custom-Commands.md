# Custom Commands

This document details the custom Cypress commands available in our framework.

## Available Commands

### Authentication Commands

```javascript
// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[name="email"]').type(email)
  cy.get('[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

// Usage:
cy.login('user@example.com', 'password123')

// Logout command
Cypress.Commands.add('logout', () => {
  cy.get('.logout-button').click()
  cy.url().should('include', '/login')
})
```

### Form Interaction Commands

```javascript
// Fill form fields
Cypress.Commands.add('fillFormFields', (fields) => {
  Object.entries(fields).forEach(([name, value]) => {
    cy.get(`[name="${name}"]`).type(value)
  })
})

// Usage:
cy.fillFormFields({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com'
})
```

### API Testing Commands

```javascript
// API request with authentication
Cypress.Commands.add('authenticatedRequest', (method, url, body = null) => {
  const token = localStorage.getItem('authToken')
  return cy.request({
    method,
    url,
    body,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
})

// Usage:
cy.authenticatedRequest('POST', '/api/data', { key: 'value' })
```

## Creating New Commands

### Template

```javascript
Cypress.Commands.add('commandName', (param1, param2) => {
  // Command implementation
})

// With custom options
Cypress.Commands.add('commandName', (param1, options = {}) => {
  const defaultOptions = {
    timeout: 10000,
    log: true
  }
  const mergedOptions = { ...defaultOptions, ...options }
  
  // Command implementation using mergedOptions
})
```

### Best Practices

1. **Documentation**
```javascript
/**
 * Custom command to login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @example
 *    cy.login('user@example.com', 'password123')
 */
Cypress.Commands.add('login', (email, password) => {
  // Implementation
})
```

2. **Error Handling**
```javascript
Cypress.Commands.add('safeClick', { prevSubject: 'element' }, (subject, options = {}) => {
  try {
    cy.wrap(subject).click(options)
  } catch (error) {
    cy.log(`Click failed: ${error.message}`)
    throw error
  }
})
```

3. **Chainable Commands**
```javascript
Cypress.Commands.add('validateField', { prevSubject: 'element' }, (subject, validation) => {
  // Validation implementation
  return cy.wrap(subject)
})

// Usage:
cy.get('input')
  .validateField('required')
  .validateField('email')
```

## Command Categories

### Element Interaction
```javascript
// Wait for element and click
Cypress.Commands.add('waitAndClick', (selector, options = {}) => {
  cy.get(selector, options)
    .should('be.visible')
    .click()
})

// Force click if element is covered
Cypress.Commands.add('forceClick', (selector) => {
  cy.get(selector).click({ force: true })
})
```

### Validation
```javascript
// Verify element state
Cypress.Commands.add('shouldBeEnabled', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject)
    .should('be.enabled')
    .should('not.have.attr', 'disabled')
})

// Check multiple attributes
Cypress.Commands.add('hasAttributes', { prevSubject: 'element' }, (subject, attributes) => {
  Object.entries(attributes).forEach(([attr, value]) => {
    cy.wrap(subject).should('have.attr', attr, value)
  })
})
```

### Data Management
```javascript
// Load and use test data
Cypress.Commands.add('loadTestData', (filename) => {
  cy.fixture(filename).as('testData')
})

// Clear application state
Cypress.Commands.add('clearAppState', () => {
  localStorage.clear()
  sessionStorage.clear()
  cy.clearCookies()
  cy.clearLocalStorage()
})
```

## Usage Examples

### Complete Test Example
```javascript
describe('User Management', () => {
  beforeEach(() => {
    cy.clearAppState()
    cy.loadTestData('user.json')
  })

  it('should create new user', function() {
    cy.login('admin@example.com', 'admin123')
    cy.waitAndClick('#create-user-btn')
    cy.fillFormFields(this.testData.newUser)
    cy.get('form').within(() => {
      cy.get('button[type="submit"]')
        .shouldBeEnabled()
        .click()
    })
  })
})
```