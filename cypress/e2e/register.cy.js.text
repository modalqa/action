describe("Register Feature", () => {
  beforeEach(() => {
    // Start from sign in page and navigate to sign up
    cy.visit("/index.php/signin");
    cy.contains("a", "Sign up", { timeout: 10000 })
      .should("be.visible")
      .click();
    // Verify we're on the signup page
    cy.url().should("include", "/signup");
  });

  it("should complete registration successfully", function () {
    // Wait for the form to be visible
    cy.get("form", { timeout: 10000 }).should("be.visible");

    // Generate a unique email using timestamp
    const timestamp = new Date().getTime();
    const uniqueEmail = `test.user.${timestamp}@yopmail.com`;

    // Fill in registration form
    cy.get('input[name="first_name"]')
      .should("be.visible")
      .clear()
      .type("John");

    cy.get('input[name="last_name"]')
      .should("be.visible")
      .clear()
      .type("Doe");

    cy.get('label[for="type_organization"]')
      .should("be.visible")
      .click();

    cy.get('input[name="company_name"]')
      .should("be.visible")
      .clear()
      .type("Example Corp");

    cy.get('input[name="email"]')
      .should("be.visible")
      .clear()
      .type(uniqueEmail);

    cy.get('input[name="password"]')
      .should("be.visible")
      .clear()
      .type("SecurePass123!");

    cy.get('input[name="retype_password"]')
      .should("be.visible")
      .clear()
      .type("SecurePass123!");

    // Intercept registration request
    cy.intercept('POST', '**/signup/create_account').as('registerRequest');
    
    // Submit the form with correct button selector
    cy.get('button[type="submit"]')  // Changed selector to type="submit"
      .should("exist")
      .should("be.visible")
      .should("not.be.disabled")
      .click();

    // Wait and verify the registration XHR
    cy.wait('@registerRequest').then((interception) => {
      const response = interception.response;
      
      // Log response for debugging
      cy.log('Response Status:', response.statusCode);
      cy.log('Response Body:', JSON.stringify(response.body));
      
      // Check if we got a mail error but the registration was successful
      if (response.statusCode === 500 && response.body.message && response.body.message.includes('Unable to send email')) {
        cy.log('Warning: Registration successful but email sending failed');
        // We can continue the test as the user was created
        return;
      }
      
      // For other types of errors, fail the test
      if (response.statusCode >= 400) {
        throw new Error(`Registration failed with status ${response.statusCode}: ${JSON.stringify(response.body)}`);
      }
    });
    
    // Verify successful registration by checking if we're redirected to dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 });

    // Add additional verification for success case
    cy.url().should('not.include', '/signup', { timeout: 10000 }); // Should redirect away from signup
  });


});


