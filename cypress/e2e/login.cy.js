describe("Login Feature", () => {
  beforeEach(() => {
    cy.visit("/index.php/signin");
  });

  it("Form login displayed", function () {
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });
  it("User can access sign up page", function () {
    cy.contains("a", "Sign up", { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.url().should("include", "/signup");
  });
});
