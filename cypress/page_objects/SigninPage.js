class SigninPage {
  visit() {
    cy.visit("/index.php/signin");
  }

  clickSignUp() {
    cy.contains("Sign Up").click();
  }
}

module.exports = new SigninPage();
