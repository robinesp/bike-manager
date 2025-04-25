import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeSearchComponent } from './bike-search.component';

describe('BikeSearchComponent', () => {
  let component: BikeSearchComponent;
  let fixture: ComponentFixture<BikeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BikeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
