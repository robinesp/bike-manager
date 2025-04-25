Cypress.Commands.add('bikeCardShouldContain', (bikeCard, title, manufacturer) => {
  cy.wrap(bikeCard).find('h3').should('contain.text', title);
  cy.wrap(bikeCard).find('.text-gray-600').first().should('contain.text', manufacturer);
});

Cypress.Commands.add('searchBikes', cityName => {
  cy.get('input[matInput]').as('searchInput');
  cy.get('@searchInput').clear();
  cy.get('@searchInput').type(cityName);
  cy.get('button').contains('Search').click();
  cy.wait(1000);
});

Cypress.Commands.add('viewBikeDetails', (bikeIndex = 0) => {
  cy.get('app-bike-card').eq(bikeIndex).find('button[mat-raised-button]').click();
});
