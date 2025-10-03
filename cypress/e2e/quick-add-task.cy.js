describe("Quick Add Task Feature", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/index.php/signin');
  });

  it('should add a new task using quick-add feature as admin', () => {
    // Login sebagai admin1
    cy.loginByRole('admin1');
    cy.url().should('include', '/dashboard');
    
    // Quick add
    cy.get('#quick-add-icon').should('be.visible').click();
    cy.get('#js-quick-add-task').should('be.visible').click();
    cy.wait(1000);

    // Generate random title & description
    const randomSuffix = Math.floor(Math.random() * 100000);
    const taskTitle = `Test Task ${randomSuffix}`;
    const taskDescription = `This is a random test description #${randomSuffix}`;

    // Generate today & tomorrow dates (YYYY-MM-DD)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];
    const startDate = formatDate(today);
    const deadlineDate = formatDate(tomorrow);

    // Isi form
    cy.get('#task-form').should('be.visible').within(() => {
      cy.get('input[name="title"]').should('be.visible').clear().type(taskTitle);
      cy.get('textarea[name="description"]').should('be.visible').clear().type(taskDescription);
      cy.get('select[name="points"]').select('3', { force: true });
      cy.get('input[name="start_date"]').clear().type(startDate);
      cy.get('input[name="deadline"]').clear().type(deadlineDate);
    });

    // Save
    cy.get('#save-and-show-button')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.wait(2000);

    cy.url().then(url => {
      cy.log(`Current URL after save: ${url}`);
      expect(url).to.match(/tasks\/view\/\d+$/);
    });

    // Assert judul sesuai input
  cy.contains(taskTitle);

    // Assert deskripsi sesuai input
  cy.contains(taskDescription);
  });
});
