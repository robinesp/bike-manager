import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { SearchStateService } from './search-state.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subject } from 'rxjs';
import { Bike } from '../models/bike.model';

describe('SearchStateService', () => {
  let service: SearchStateService;
  let mockRouter: Router;
  let eventsSubject: Subject<Event>;

  beforeEach(() => {
    eventsSubject = new Subject<Event>();
    mockRouter = {
      events: eventsSubject.asObservable(),
      navigate: jest.fn(),
    } as unknown as Router;

    service = new SearchStateService(mockRouter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.lastSearchCity).toBe('');
    expect(service.searchResults).toEqual([]);
    expect(service.currentPage).toBe(1);
    expect(service.searchPerformed).toBe(false);
  });

  it('should save search state', () => {
    const mockBikes: Bike[] = [
      {
        id: 1,
        title: 'Test Bike',
        stolen: true,
        frame_colors: ['Red'],
        manufacturer_name: 'Test Manufacturer',
        year: 2023,
        date_stolen: 1643673600,
        description: 'Test description',
        frame_model: 'Test Model',
        large_img: '',
        stolen_location: 'Test City',
        thumb: '',
        url: 'http://example.com',
        api_url: 'http://api.example.com',
        serial: 'ABC123',
        status: 'stolen',
      },
    ];
    const testCity = 'Amsterdam';
    const testPage = 2;

    service.saveSearchState(testCity, mockBikes, testPage);

    expect(service.lastSearchCity).toBe(testCity);
    expect(service.searchResults).toEqual(mockBikes);
    expect(service.currentPage).toBe(testPage);
    expect(service.searchPerformed).toBe(true);
  });

  it('should clear search state', () => {
    // First set some state
    service.saveSearchState('Amsterdam', [{} as Bike], 2);
    expect(service.searchPerformed).toBe(true);

    // Then clear it
    service.clearSearchState();

    expect(service.lastSearchCity).toBe('');
    expect(service.searchResults).toEqual([]);
    expect(service.currentPage).toBe(1);
    expect(service.searchPerformed).toBe(false);
  });

  it('should clear search state when navigating to root from a non-detail page', () => {
    // Mock initial state
    service.saveSearchState('Amsterdam', [{} as Bike], 2);

    // Simulate navigation to home from a non-detail page
    eventsSubject.next(new NavigationEnd(1, '/', '/'));

    expect(service.searchPerformed).toBe(false);
    expect(service.lastSearchCity).toBe('');
  });

  it('should preserve search state when navigating to root from a detail page', () => {
    // Set initial state
    service.saveSearchState('Amsterdam', [{} as Bike], 2);

    // Simulate navigation to a bike detail page
    eventsSubject.next(new NavigationEnd(1, '/bikes/123', '/bikes/123'));

    // Then navigate to root
    eventsSubject.next(new NavigationEnd(2, '/', '/'));

    // State should be preserved because we came from a detail page
    expect(service.searchPerformed).toBe(true);
    expect(service.lastSearchCity).toBe('Amsterdam');
  });
});
