import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { BikeSearchComponent } from './bike-search.component';
import { of, throwError } from 'rxjs';
import { BikeService } from '../../services/bike.service';

describe('BikeSearchComponent', () => {
  let component: BikeSearchComponent;

  // Mock the BikeService
  const mockBikeService = {
    searchBikes: jest.fn(),
  } as unknown as BikeService;

  // Original window properties
  let originalInnerHeight: number;
  let originalScrollY: number;
  let originalOffsetHeight: number;

  beforeEach(() => {
    // Save original values
    originalInnerHeight = window.innerHeight;
    originalScrollY = window.scrollY;
    originalOffsetHeight = document.body.offsetHeight;

    // Reset mocks
    jest.clearAllMocks();

    // Set up default mock response
    (mockBikeService.searchBikes as jest.Mock).mockReturnValue(
      of({
        bikes: [
          {
            id: 1,
            title: 'Test Bike 1',
            stolen: true,
            frame_colors: ['black'],
            manufacturer_name: 'Test Manufacturer',
            year: 2022,
          },
          {
            id: 2,
            title: 'Test Bike 2',
            stolen: true,
            frame_colors: ['red'],
            manufacturer_name: 'Test Manufacturer 2',
            year: 2023,
          },
        ],
      })
    );

    // Create component with mocked service
    component = new BikeSearchComponent(mockBikeService);

    // Mock window and document for onScroll testing
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      configurable: true,
    });

    Object.defineProperty(window, 'scrollY', {
      value: 0,
      configurable: true,
    });

    Object.defineProperty(document.body, 'offsetHeight', {
      value: 1000,
      configurable: true,
    });
  });

  // Restore original properties after tests
  afterEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      configurable: true,
    });

    Object.defineProperty(window, 'scrollY', {
      value: originalScrollY,
      configurable: true,
    });

    Object.defineProperty(document.body, 'offsetHeight', {
      value: originalOffsetHeight,
      configurable: true,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search bikes when onSearch is called with valid city', () => {
    component.city = 'New York';
    component.onSearch();

    expect(mockBikeService.searchBikes).toHaveBeenCalledWith('New York', 1, 10);
    expect(component.loading).toBe(false);
    expect(component.searchPerformed).toBe(true);
    expect(component.bikes.length).toBe(2);
  });

  it('should set error when searching with empty city', () => {
    component.city = '   ';
    component.onSearch();

    expect(mockBikeService.searchBikes).not.toHaveBeenCalled();
    expect(component.error).toBe('Please enter a city name');
  });

  it('should load more bikes when loadMoreBikes is called', () => {
    // Set up initial state
    component.city = 'New York';
    component.searchPerformed = true;
    component.currentPage = 1;

    // Call the method
    component.loadMoreBikes();

    // Verify second page was requested
    expect(mockBikeService.searchBikes).toHaveBeenCalledWith('New York', 2, 10);
    expect(component.currentPage).toBe(2);
    expect(component.isLoadingMore).toBe(false);
  });

  it('should handle API errors when searching', () => {
    component.city = 'New York';
    (mockBikeService.searchBikes as jest.Mock).mockReturnValueOnce(
      throwError(() => new Error('API error'))
    );

    component.onSearch();

    expect(component.loading).toBe(false);
    expect(component.error).toBe('An error occurred while searching for bikes. Please try again.');
  });

  it('should handle API errors when loading more bikes', () => {
    component.city = 'New York';
    component.searchPerformed = true;
    component.currentPage = 1;
    (mockBikeService.searchBikes as jest.Mock).mockReturnValueOnce(
      throwError(() => new Error('API error'))
    );

    component.loadMoreBikes();

    expect(component.isLoadingMore).toBe(false);
    expect(component.error).toBe('An error occurred while loading more bikes. Please try again.');
  });

  it('should set allBikesLoaded to true when receiving fewer bikes than requested', () => {
    component.city = 'New York';
    (mockBikeService.searchBikes as jest.Mock).mockReturnValueOnce(
      of({
        bikes: [
          {
            id: 1,
            title: 'Test Bike 1',
            stolen: true,
            frame_colors: ['black'],
            manufacturer_name: 'Test Manufacturer',
            year: 2022,
          },
        ],
      })
    );

    component.onSearch();

    expect(component.allBikesLoaded).toBe(true);
  });

  it('should not load more bikes if already loading', () => {
    component.city = 'New York';
    component.isLoadingMore = true;
    component.currentPage = 1;

    component.loadMoreBikes();

    expect(mockBikeService.searchBikes).not.toHaveBeenCalled();
    expect(component.currentPage).toBe(1);
  });

  it('should not load more bikes if all bikes are loaded', () => {
    component.city = 'New York';
    component.isLoadingMore = false;
    component.allBikesLoaded = true;
    component.currentPage = 1;

    component.loadMoreBikes();

    expect(mockBikeService.searchBikes).not.toHaveBeenCalled();
    expect(component.currentPage).toBe(1);
  });

  it('should trigger load more bikes when scrolled to bottom', () => {
    component.searchPerformed = true;
    component.loading = false;
    component.isLoadingMore = false;
    component.allBikesLoaded = false;
    component.city = 'New York';

    // Mock scroll to bottom
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 700, configurable: true });
    Object.defineProperty(document.body, 'offsetHeight', { value: 1000, configurable: true });

    component.onScroll();

    expect(mockBikeService.searchBikes).toHaveBeenCalled();
  });

  it('should not trigger load more bikes when not scrolled to bottom', () => {
    component.searchPerformed = true;
    component.loading = false;
    component.isLoadingMore = false;
    component.allBikesLoaded = false;
    component.city = 'New York';

    // Mock scroll position not at bottom
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    Object.defineProperty(document.body, 'offsetHeight', { value: 1000, configurable: true });

    component.onScroll();

    expect(mockBikeService.searchBikes).not.toHaveBeenCalled();
  });
});
