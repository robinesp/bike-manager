describe('Bike Detail View', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.searchBikes('New York');
    cy.get('app-bike-card').should('have.length.greaterThan', 0);
  });

  it('should navigate to bike detail page when clicking on a bike card', () => {
    cy.viewBikeDetails(0);
    cy.url().should('include', '/bikes/');
    cy.get('h1, h2, h3').should('exist');
  });

  it('should display bike image and details on detail page', () => {
    cy.viewBikeDetails(0);
    cy.get('img').should('be.visible');
    cy.get('.text-gray-600, .text-gray-700, .text-gray-800').should('exist');
  });

  it('should navigate back to search page when clicking back button', () => {
    cy.viewBikeDetails(0);
    cy.url().should('include', '/bikes/');
    cy.get('button').contains('Back').click();
    cy.url().should('not.include', '/bikes/');
    cy.get('input[matInput]').should('exist');
  });

  it('should display theft status on bike detail page', () => {
    cy.viewBikeDetails(0);
    cy.get('span.bg-red-500, span.bg-green-500, .stolen-status, .status-indicator').should('exist');
  });

  it('should display basic bike information', () => {
    cy.viewBikeDetails(0);
    cy.get('h1').should('exist');
    cy.get('.text-gray-600, .text-gray-700').should('exist');
  });
});
