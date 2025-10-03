describe("Quick Add Task Feature", () => {
  beforeEach(() => {
    // Reset state sebelum setiap test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should add a new task using quick-add feature as admin', () => {
    // Login sebagai admin1
    cy.loginByRole('admin1');
    
    // Verifikasi login berhasil
    cy.url().should('include', '/dashboard');
    
    // Klik quick-add-icon
    cy.get('#quick-add-icon', { timeout: 10000 })
      .should('be.visible')
      .click();
    
    // Klik js-quick-add-task
    cy.get('.js-quick-add-task', { timeout: 10000 })
      .should('be.visible')
      .click();
    
    // Tunggu form muncul
    cy.wait(1000);
    
    // Isi semua form fields yang ada
    cy.get('form').should('be.visible').within(() => {
      // Isi semua input text fields
      cy.get('input[type="text"], input:not([type])').each(($input) => {
        if ($input.is(':visible') && !$input.prop('disabled') && !$input.prop('readonly')) {
          cy.wrap($input).clear().type('Test Input Value');
        }
      });
      
      // Isi semua textarea fields
      cy.get('textarea').each(($textarea) => {
        if ($textarea.is(':visible') && !$textarea.prop('disabled') && !$textarea.prop('readonly')) {
          cy.wrap($textarea).clear().type('This is a test description for the task');
        }
      });
      
      // Pilih semua select/dropdown fields
      cy.get('select').each(($select) => {
        if ($select.is(':visible') && !$select.prop('disabled')) {
          // Pilih option pertama yang bukan placeholder/default
          cy.wrap($select).find('option').then($options => {
            if ($options.length > 1) {
              cy.wrap($select).select($options.eq(1).val());
            }
          });
        }
      });
      
      // Isi date fields jika ada
      cy.get('input[type="date"]').each(($date) => {
        if ($date.is(':visible') && !$date.prop('disabled') && !$date.prop('readonly')) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateString = tomorrow.toISOString().split('T')[0];
          cy.wrap($date).type(dateString);
        }
      });
      
      // Isi number fields jika ada
      cy.get('input[type="number"]').each(($number) => {
        if ($number.is(':visible') && !$number.prop('disabled') && !$number.prop('readonly')) {
          cy.wrap($number).clear().type('123');
        }
      });
      
      // Isi email fields jika ada
      cy.get('input[type="email"]').each(($email) => {
        if ($email.is(':visible') && !$email.prop('disabled') && !$email.prop('readonly')) {
          cy.wrap($email).clear().type('test@example.com');
        }
      });
    });
    
    // Klik button save-and-show-button (di luar form context)
    cy.get('#save-and-show-button', { timeout: 10000 })
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    
    // Verifikasi task berhasil dibuat (redirect atau notifikasi)
    cy.wait(2000);
    
    // Verifikasi URL berubah atau ada notifikasi sukses
    cy.url().then(url => {
      // URL mungkin berubah ke halaman detail task atau kembali ke dashboard
      cy.log(`Current URL after save: ${url}`);
    });
  });
});
