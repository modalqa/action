describe("Login Feature", () => {
  beforeEach(() => {
    // Reset state sebelum setiap test
    cy.visit("/index.php/signin");
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  context('Login with different roles', () => {
    it('should login successfully as admin1', () => {
      cy.loginByRole('admin1');
      // Tambahan verifikasi untuk admin1
      cy.url().should('include', '/dashboard');
      // Bisa ditambahkan verifikasi elemen spesifik untuk admin
    });

    it('should login successfully as admin2', () => {
      cy.loginByRole('admin2');
      // Tambahan verifikasi untuk admin2
      cy.url().should('include', '/dashboard');
      // Bisa ditambahkan verifikasi elemen spesifik untuk admin
    });

    it('should login successfully as client', () => {
      cy.loginByRole('client');
      // Tambahan verifikasi untuk client
      cy.url().should('include', '/dashboard');
      // Bisa ditambahkan verifikasi elemen spesifik untuk client
    });
  });

  context('Login form validation', () => {
    it('should show error with invalid credentials', () => {
      // Input invalid credentials
      cy.get('input[name="email"]').type('wrong@email.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      // Verifikasi pesan error
      cy.get('.alert-danger')
        .should('be.visible')
        .and('contain', 'Authentication failed');
    });

    it('should require email', () => {
      // Submit form tanpa email
      cy.get('input[name="password"]').type('anypassword');
      cy.get('button[type="submit"]').click();
      
      // Verifikasi form tidak tersubmit
      cy.url().should('include', '/signin');
    });

    it('should require password', () => {
      // Submit form tanpa password
      cy.get('input[name="email"]').type('test@email.com');
      cy.get('button[type="submit"]').click();
      
      // Verifikasi form tidak tersubmit
      cy.url().should('include', '/signin');
    });
  });

  context('Login functionality', () => {
    it('should allow logout after successful login', () => {
      cy.loginByRole('admin1');
      
      // Logout process
      cy.get('#user-dropdown', { timeout: 10000 })
        .should('be.visible')
        .click();
      
      cy.contains('Sign Out')
        .should('be.visible')
        .click();
      
      // Verify redirect to login page
      cy.url().should('include', '/signin');
    });

    it('should maintain login state after page refresh', () => {
      cy.loginByRole('admin1');
      cy.reload();
      cy.url().should('include', '/dashboard');
    });
  });
});
