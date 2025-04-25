import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AppComponent } from './app.component';
import { SearchStateService } from './services/search-state.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let mockSearchStateService: SearchStateService;

  beforeEach(() => {
    mockSearchStateService = {
      clearSearchState: jest.fn(),
      saveSearchState: jest.fn(),
      lastSearchCity: '',
      searchResults: [],
      currentPage: 1,
      searchPerformed: false,
      needsClear: false,
      requestClearState: jest.fn(),
    } as unknown as SearchStateService;

    component = new AppComponent(mockSearchStateService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'bike-manager' title`, () => {
    expect(component.title).toEqual('bike-manager');
  });

  it('should initialize with default values', () => {
    expect(component.title).toBeDefined();
    expect(typeof component.title).toBe('string');
  });

  it('should maintain consistent title value', () => {
    const expectedTitle = 'bike-manager';
    expect(component.title).toEqual(expectedTitle);

    // Verify title doesn't change unexpectedly
    const cachedTitle = component.title;
    expect(component.title).toEqual(cachedTitle);
  });

  it('should request clearing search state when clearSearch is called', () => {
    component.clearSearch();
    expect(mockSearchStateService.clearSearchState).toHaveBeenCalled();
  });
});
