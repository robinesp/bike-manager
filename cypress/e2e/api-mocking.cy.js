describe('API Mocking Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display mocked bike search results', () => {
    cy.intercept('GET', '**/api/v3/search*', { fixture: 'bike-data.json' }).as('bikeSearch');
    cy.searchBikes('Mocked City');
    cy.wait('@bikeSearch');

    cy.get('app-bike-card').should('have.length', 2);

    cy.get('app-bike-card')
      .first()
      .within(() => {
        cy.get('h3').should('contain.text', 'Test Bike 1');
        cy.get('.text-gray-600').first().should('contain.text', 'Test Manufacturer');
      });
  });

  it('should handle empty search results gracefully', () => {
    cy.intercept('GET', '**/api/v3/search*', { bikes: [] }).as('emptySearch');
    cy.searchBikes('Non-existent City');
    cy.wait('@emptySearch');

    cy.get('app-bike-card').should('not.exist');
  });

  it('should handle pagination in search results', () => {
    const paginatedResponse = {
      bikes: Array(10)
        .fill()
        .map((_, i) => ({
          id: i + 1,
          title: `Paginated Bike ${i + 1}`,
          manufacturer_name: 'Test Manufacturer',
          frame_model: 'Test Model',
          year: 2023,
          frame_colors: ['Red'],
          thumb: 'https://example.com/test-thumb.jpg',
          stolen: i % 2 === 0,
        })),
      meta: {
        per_page: 10,
        current_page: 1,
        total_pages: 5,
      },
    };

    cy.intercept('GET', '**/api/v3/search*', paginatedResponse).as('firstPageSearch');
    cy.searchBikes('Pagination Test');
    cy.wait('@firstPageSearch');

    cy.get('app-bike-card').should('have.length', 10);

    const nextPageResponse = {
      ...paginatedResponse,
      bikes: Array(5)
        .fill()
        .map((_, i) => ({
          id: i + 11,
          title: `Paginated Bike ${i + 11}`,
          manufacturer_name: 'Test Manufacturer',
          frame_model: 'Test Model',
          year: 2023,
          frame_colors: ['Blue'],
          thumb: 'https://example.com/test-thumb.jpg',
          stolen: i % 2 === 0,
        })),
      meta: {
        per_page: 10,
        current_page: 2,
        total_pages: 5,
      },
    };

    cy.intercept('GET', '**/api/v3/search*', nextPageResponse).as('nextPageSearch');
    cy.scrollTo('bottom');
    cy.get('app-bike-card').should('exist');
  });

  it('should handle network error gracefully', () => {
    cy.intercept('GET', '**/api/v3/search*', {
      forceNetworkError: true,
    }).as('networkError');

    cy.searchBikes('Error City');
    cy.get('.text-red-600, .error-message, mat-error').should('exist');
  });

  it('should mock single bike detail response', () => {
    cy.intercept('GET', '**/api/v3/bikes/*', {
      bike: {
        id: 999,
        title: 'Mocked Detail Bike',
        manufacturer_name: 'Mock Manufacturer',
        frame_model: 'Mock Model',
        year: 2024,
        frame_colors: ['Purple', 'Gold'],
        thumb: 'https://example.com/mock-thumb.jpg',
        large_img: 'https://example.com/mock-large.jpg',
        status: 'stolen',
        stolen: true,
        stolen_location: 'Mock City, ST',
        date_stolen: 1643673600,
        description: 'This is a mocked bike for testing',
        serial: 'MOCK123',
      },
    }).as('bikeDetail');

    cy.intercept('GET', '**/api/v3/search*', { fixture: 'bike-data.json' }).as('bikeSearch');
    cy.searchBikes('Mocked City');
    cy.wait('@bikeSearch');

    cy.viewBikeDetails(0);
    cy.wait('@bikeDetail');

    cy.contains('Mocked Detail Bike').should('exist');
    cy.contains('Mock Manufacturer').should('exist');
    cy.contains('MOCK123').should('exist');
  });
});
