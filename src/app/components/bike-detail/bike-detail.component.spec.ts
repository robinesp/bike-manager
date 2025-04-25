import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { BikeDetailComponent } from './bike-detail.component';
import { of, throwError, Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BikeService } from '../../services/bike.service';
import { Bike } from '../../models/bike.model';

// Type for param map subscription callback
interface ParamMapSubscriber {
  (value: ParamMap): void;
}

describe('BikeDetailComponent', () => {
  let component: BikeDetailComponent;

  // Mock dependencies with proper Jest mock typing
  const mockActivatedRoute = {
    paramMap: {
      subscribe: jest.fn(),
    },
  } as unknown as ActivatedRoute;

  const mockRouter = {
    navigate: jest.fn(),
  } as unknown as Router;

  const mockBikeService = {
    getBikeDetails: jest.fn(),
  } as unknown as BikeService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create component with mocked dependencies
    component = new BikeDetailComponent(mockActivatedRoute, mockRouter, mockBikeService);

    // Setup default mock behavior
    (mockActivatedRoute.paramMap.subscribe as jest.Mock).mockImplementation((fn: unknown) => {
      // Type guard to ensure fn is a function before calling it
      if (typeof fn === 'function') {
        const subscriber = fn as ParamMapSubscriber;
        subscriber({
          get: (_: string) => '123',
          has: (_: string) => true,
          getAll: (_: string) => ['123'],
          keys: [] as string[],
        } as ParamMap);
      }
      return { unsubscribe: jest.fn() } as unknown as Subscription;
    });

    (mockBikeService.getBikeDetails as jest.Mock).mockReturnValue(
      of({
        bike: {
          id: 123,
          title: 'Test Bike',
          manufacturer_name: 'Test Manufacturer',
          frame_model: 'Test Model',
          year: 2023,
          frame_colors: ['Red'],
          stolen: true,
          stolen_location: 'Test City',
          date_stolen: 1643673600, // 01/01/2022
          description: 'Test description',
          url: 'http://example.com',
          api_url: 'http://api.example.com',
          serial: 'ABC123',
        } as Bike,
      })
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch bike details on init', () => {
    component.ngOnInit();
    expect(mockBikeService.getBikeDetails).toHaveBeenCalledWith(123);
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set error state when API request fails', () => {
    (mockBikeService.getBikeDetails as jest.Mock).mockReturnValueOnce(
      throwError(() => new Error('API error'))
    );

    component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(component.error).toBe('Failed to load bike details. Please try again.');
  });

  it('should navigate to home if no bike ID is provided', () => {
    (mockActivatedRoute.paramMap.subscribe as jest.Mock).mockImplementation((fn: unknown) => {
      if (typeof fn === 'function') {
        const subscriber = fn as ParamMapSubscriber;
        subscriber({
          get: (_: string) => null,
          has: (_: string) => false,
          getAll: (_: string) => [],
          keys: [] as string[],
        } as ParamMap);
      }
      return { unsubscribe: jest.fn() } as unknown as Subscription;
    });

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockBikeService.getBikeDetails).not.toHaveBeenCalled();
  });

  it('should handle non-numeric bike ID', () => {
    (mockActivatedRoute.paramMap.subscribe as jest.Mock).mockImplementation((fn: unknown) => {
      if (typeof fn === 'function') {
        const subscriber = fn as ParamMapSubscriber;
        subscriber({
          get: (_: string) => 'abc',
          has: (_: string) => true,
          getAll: (_: string) => ['abc'],
          keys: [] as string[],
        } as ParamMap);
      }
      return { unsubscribe: jest.fn() } as unknown as Subscription;
    });

    component.ngOnInit();

    // NaN becomes 0 when using +, so it should call with 0
    expect(mockBikeService.getBikeDetails).toHaveBeenCalledWith(NaN);
  });

  it('should properly set bike data after successful fetch', () => {
    component.ngOnInit();

    expect(component.bike).toEqual({
      id: 123,
      title: 'Test Bike',
      manufacturer_name: 'Test Manufacturer',
      frame_model: 'Test Model',
      year: 2023,
      frame_colors: ['Red'],
      stolen: true,
      stolen_location: 'Test City',
      date_stolen: 1643673600,
      description: 'Test description',
      url: 'http://example.com',
      api_url: 'http://api.example.com',
      serial: 'ABC123',
    });
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should correctly handle undefined bike properties', () => {
    (mockBikeService.getBikeDetails as jest.Mock).mockReturnValueOnce(
      of({
        bike: {
          id: 123,
          title: 'Test Bike',
          stolen: false,
          // Missing other properties
        } as unknown as Bike,
      })
    );

    component.ngOnInit();

    expect(component.bike).not.toBeNull();
    expect(component.bike?.id).toBe(123);
    expect(component.bike?.title).toBe('Test Bike');
    expect(component.bike?.stolen).toBe(false);
  });
});
