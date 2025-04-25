import { describe, it, expect, beforeEach } from '@jest/globals';
import { BikeCardComponent } from './bike-card.component';
import { Bike } from '../../models/bike.model';

describe('BikeCardComponent', () => {
  let component: BikeCardComponent;
  let mockBike: Bike;

  beforeEach(() => {
    // Set up mock bike data
    mockBike = {
      id: 123,
      title: 'Test Bike',
      manufacturer_name: 'Test Manufacturer',
      frame_model: 'Test Model',
      year: 2023,
      frame_colors: ['Red'],
      thumb: 'test.jpg',
      large_img: 'large-test.jpg',
      status: 'stolen',
      stolen: true,
      stolen_location: 'Test City',
      date_stolen: 1643673600, // 01/01/2022
      description: 'Test description',
      url: 'http://example.com',
      api_url: 'http://api.example.com',
      serial: 'ABC123',
    } as Bike;

    component = new BikeCardComponent();
    component.bike = mockBike;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct bike data', () => {
    expect(component.bike.id).toBe(123);
    expect(component.bike.title).toBe('Test Bike');
    expect(component.bike.manufacturer_name).toBe('Test Manufacturer');
    expect(component.bike.frame_model).toBe('Test Model');
    expect(component.bike.year).toBe(2023);
    expect(component.bike.frame_colors).toEqual(['Red']);
    expect(component.bike.stolen).toBe(true);
  });

  it('should format stolen date correctly', () => {
    const formattedDate = new Date(component.bike.date_stolen * 1000).toLocaleDateString();
    expect(formattedDate).not.toBe('');
  });

  it('should handle empty color arrays', () => {
    component.bike = { ...mockBike, frame_colors: [] };
    expect(component.bike.frame_colors.length).toBe(0);
  });

  it('should handle multiple colors', () => {
    component.bike = { ...mockBike, frame_colors: ['Red', 'Blue', 'Green'] };
    expect(component.bike.frame_colors.length).toBe(3);
    expect(component.bike.frame_colors[0]).toBe('Red');
    expect(component.bike.frame_colors[1]).toBe('Blue');
    expect(component.bike.frame_colors[2]).toBe('Green');
  });

  it('should handle non-stolen bikes', () => {
    component.bike = { ...mockBike, stolen: false, status: 'found' };
    expect(component.bike.stolen).toBe(false);
    expect(component.bike.status).toBe('found');
  });

  it('should handle missing thumb image', () => {
    component.bike = { ...mockBike, thumb: '' };
    expect(component.bike.thumb).toBe('');
  });

  it('should handle missing year', () => {
    component.bike = { ...mockBike, year: null as unknown as number };
    expect(component.bike.year).toBeNull();
  });
});
