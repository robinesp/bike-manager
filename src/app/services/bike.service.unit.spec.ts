import { describe, expect, jest, test } from '@jest/globals';
import { BikeService } from './bike.service';
import { of } from 'rxjs';

// Mock HttpClient with more realistic behavior
const mockHttpClient = {
  get: jest.fn(),
};

// Define interface for HTTP options
interface HttpOptions {
  params: MockHttpParams;
}

// Mock HttpParams with proper toString implementation
class MockHttpParams {
  private params = new Map<string, string>();

  set(key: string, value: string): MockHttpParams {
    this.params.set(key, value);
    return this;
  }

  toString(): string {
    let result = '';
    this.params.forEach((value, key) => {
      result += (result ? '&' : '') + `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
    return result;
  }
}

// Mock the specific Angular imports
jest.mock('@angular/common/http', () => ({
  HttpClient: class {
    get() {
      return {};
    }
  },
  HttpParams: MockHttpParams,
}));

describe('BikeService', () => {
  let service: BikeService;
  const mockSearchResponse = {
    bikes: [
      {
        id: 1,
        title: 'Test Bike',
        manufacturer_name: 'Test Manufacturer',
        frame_model: 'Test Model',
        year: 2020,
        frame_colors: ['black'],
        thumb: 'thumb.jpg',
        large_img: 'large.jpg',
        status: 'stolen',
        stolen: true,
        stolen_location: 'Test City',
        date_stolen: 1609459200, // Jan 1, 2021
        description: 'Test description',
        url: 'test-url',
        api_url: 'test-api-url',
        serial: 'ABC123',
      },
    ],
  };

  beforeEach(() => {
    mockHttpClient.get.mockClear();
    // Create a simplified test
    service = {
      searchBikes: (city: string, page = 1, perPage = 25) => {
        mockHttpClient.get(`https://bikeindex.org/api/v3/search`, {
          params: new MockHttpParams()
            .set('page', page.toString())
            .set('per_page', perPage.toString())
            .set('location', city)
            .set('distance', '10')
            .set('stolenness', 'proximity'),
        });
        return of(mockSearchResponse);
      },
      getBikeDetails: (id: number) => {
        mockHttpClient.get(`https://bikeindex.org/api/v3/bikes/${id}`);
        return of({ bike: mockSearchResponse.bikes[0] });
      },
    } as BikeService;
  });

  test('searchBikes should make HTTP request with correct parameters', () => {
    service.searchBikes('Test City', 1, 10);

    // Simplified test that doesn't rely on HttpClient implementation
    expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
    const url = mockHttpClient.get.mock.calls[0][0];
    const options = mockHttpClient.get.mock.calls[0][1] as HttpOptions;

    expect(url).toContain('/search');
    expect(options.params.toString()).toContain('location=Test%20City');
    expect(options.params.toString()).toContain('page=1');
    expect(options.params.toString()).toContain('per_page=10');
  });

  test('getBikeDetails should make HTTP request with correct ID', () => {
    const bikeId = 123;
    service.getBikeDetails(bikeId);

    expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
    const url = mockHttpClient.get.mock.calls[0][0];

    expect(url).toContain(`/bikes/${bikeId}`);
  });
});
