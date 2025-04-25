describe('Application Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have correct page title', () => {
    cy.title().should('include', 'Bike Manager');
  });

  it('should navigate to home page with logo click', () => {
    cy.searchBikes('New York');
    cy.get('app-bike-card').should('have.length.greaterThan', 0);
    cy.viewBikeDetails(0);
    cy.url().should('include', '/bikes/');
    cy.get('a[routerLink="/"]').first().click();
    cy.url().should('not.include', '/bikes/');
    cy.get('mat-label').should('contain.text', 'Enter city name');
  });

  it('should allow direct navigation to bike detail', () => {
    cy.searchBikes('New York');
    cy.viewBikeDetails(0);
    cy.url().then(url => {
      cy.visit('/');
      cy.visit(url);
      cy.url().should('include', '/bikes/');
      cy.get('img').should('be.visible');
    });
  });

  it('should maintain basic navigation with browser back button', () => {
    cy.searchBikes('New York');
    cy.viewBikeDetails(0);
    cy.url().should('include', '/bikes/');
    cy.go('back');
    cy.url().should('not.include', '/bikes/');
  });
});
