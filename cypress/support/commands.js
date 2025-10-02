// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
/**

 @param {string} role
 @example
 *    cy.loginByRole('admin1')
 *    cy.loginByRole('client')
 */
Cypress.Commands.add('loginByRole', (role) => {
  cy.fixture('users.json').then((users) => {
    const user = users[role];
    if (!user) {
      throw new Error(`Role "${role}" tidak ditemukan dalam users.json`);
    }

    cy.visit('/index.php/signin');
    
    // Tunggu form login muncul
    cy.get('form', { timeout: 10000 }).should('be.visible');

    // Isi form login
    cy.get('input[name="email"]')
      .should('be.visible')
      .clear()
      .type(user.email);

    cy.get('input[name="password"]')
      .should('be.visible')
      .clear()
      .type(user.password);

    // Submit form
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();

    // Verifikasi login berhasil
    cy.url().should('include', '/dashboard');

    // Log untuk informasi
    cy.log(`Logged in as ${role} (${user.role}) with email ${user.email}`);
  });
});

/**
 * Custom command untuk login dengan email dan password
 * @param {string} email - Email pengguna
 * @param {string} password - Password pengguna
 * @example
 *    cy.login('user@example.com', 'password123')
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/index.php/signin');
  
  // Tunggu form login muncul
  cy.get('form', { timeout: 10000 }).should('be.visible');

  // Isi form login
  cy.get('input[name="email"]')
    .should('be.visible')
    .clear()
    .type(email);

  cy.get('input[name="password"]')
    .should('be.visible')
    .clear()
    .type(password);

  // Submit form
  cy.get('button[type="submit"]')
    .should('be.visible')
    .click();

  // Tunggu response
  cy.wait(1000);

  // Cek URL setelah submit
  cy.url().then(url => {
    if (url.includes('/dashboard')) {
      // Login berhasil
      cy.log('Login successful');
    } else {
      // Login gagal, cek pesan error
      cy.get('.alert-danger').should('be.visible');
    }
  });
});