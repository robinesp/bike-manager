describe('Bike Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the search form on home page', () => {
    cy.get('mat-label').should('contain.text', 'Enter city name');
    cy.get('input[matInput]').should('exist');
    cy.get('button').contains('Search').should('exist');
  });

  it('should display error when searching with empty city', () => {
    cy.get('button').contains('Search').click();
    cy.get('.text-red-600, .error-message').should('be.visible');
  });

  it('should search for bikes in a valid city and display results', () => {
    cy.searchBikes('New York');
    cy.get('app-bike-card').should('have.length.greaterThan', 0);

    cy.get('app-bike-card')
      .first()
      .within(() => {
        cy.get('img').should('be.visible');
        cy.get('h3').should('exist');
        cy.get('.text-gray-600').should('exist');
        cy.get('button').contains('View Details').should('exist');
      });
  });

  it('should show theft status indicator on bike cards', () => {
    cy.searchBikes('New York');
    cy.get('app-bike-card')
      .first()
      .within(() => {
        cy.get('.bg-red-500, .bg-green-500').should('exist');
      });
  });

  it('should clear previous results when performing a new search', () => {
    cy.searchBikes('New York');
    cy.get('app-bike-card').should('have.length.greaterThan', 0);

    cy.searchBikes('Chicago');
    cy.get('app-bike-card').should('exist');
  });

  it('should handle special characters in search input', () => {
    cy.searchBikes('San Francisco, CA');
    cy.get('app-bike-card').should('exist');
  });
});
