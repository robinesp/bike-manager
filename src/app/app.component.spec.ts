import { describe, it, expect, beforeEach } from '@jest/globals';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent();
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
});
