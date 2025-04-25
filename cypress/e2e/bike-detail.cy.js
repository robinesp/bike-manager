describe('Bike Detail View', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.searchBikes('New York');
    cy.get('app-bike-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('should navigate to bike detail page when clicking on a bike card', () => {
    cy.viewBikeDetails(0);
    cy.url().should('include', '/bikes/');
    cy.get('h1').should('exist');
  });

  it('should display bike image and details on detail page', () => {
    cy.viewBikeDetails(0);
    // Check for image container
    cy.get('.relative.w-full.h-\\[400px\\], .bg-gray-100').should('be.visible');
    // Check for details
    cy.get('mat-list-item').should('have.length.greaterThan', 3);
  });

  it('should navigate back to search page when clicking back button', () => {
    cy.viewBikeDetails(0);
    cy.url().should('include', '/bikes/');
    cy.get('button').contains('Back to Search').click();
    cy.url().should('not.include', '/bikes/');
    cy.get('input[matInput]').should('exist');
  });

  it('should display theft status on bike detail page', () => {
    cy.viewBikeDetails(0);
    cy.get('.bg-red-500, .bg-green-500, [class*="bg-red-"], [class*="bg-green-"]').should('exist');
  });

  it('should display basic bike information', () => {
    cy.viewBikeDetails(0);
    cy.get('h1').should('exist');
    cy.get('mat-list').should('exist');
  });
});
