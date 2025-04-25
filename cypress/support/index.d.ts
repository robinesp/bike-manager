/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to verify bike card contains expected data
     * @example cy.bikeCardShouldContain(bikeCard, 'Test Bike', 'Test Manufacturer')
     */
    bikeCardShouldContain(
      bikeCard: JQuery<HTMLElement>,
      title: string,
      manufacturer: string
    ): Chainable<any>;

    /**
     * Custom command to search for bikes in a city
     * @example cy.searchBikes('New York')
     */
    searchBikes(cityName: string): Chainable<any>;

    /**
     * Custom command to view bike details by clicking on a bike card
     * @example cy.viewBikeDetails(0) // Clicks on the first bike card
     */
    viewBikeDetails(bikeIndex?: number): Chainable<any>;
  }
}
