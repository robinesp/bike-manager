import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BikeService } from '../../services/bike.service';
import { Bike } from '../../models/bike.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BikeCardComponent } from '../bike-card/bike-card.component';

@Component({
  selector: 'app-bike-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatFormFieldModule,
    BikeCardComponent,
  ],
  templateUrl: './bike-search.component.html',
})
export class BikeSearchComponent {
  city: string = '';
  bikes: Bike[] = [];
  loading: boolean = false;
  searchPerformed: boolean = false;
  error: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isLoadingMore: boolean = false;
  allBikesLoaded: boolean = false;

  constructor(private bikeService: BikeService) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Check if we've scrolled to the bottom of the page
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      !this.isLoadingMore &&
      !this.loading &&
      this.searchPerformed &&
      !this.allBikesLoaded
    ) {
      this.loadMoreBikes();
    }
  }

  onSearch(): void {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name';
      return;
    }

    // Reset search state
    this.error = null;
    this.loading = true;
    this.searchPerformed = true;
    this.currentPage = 1;
    this.allBikesLoaded = false;
    this.bikes = [];

    this.bikeService.searchBikes(this.city, this.currentPage, this.itemsPerPage).subscribe({
      next: response => {
        this.bikes = response.bikes;
        this.loading = false;
        this.allBikesLoaded = response.bikes.length < this.itemsPerPage;
      },
      error: err => {
        console.error('Error searching bikes:', err);
        this.error = 'An error occurred while searching for bikes. Please try again.';
        this.loading = false;
      },
    });
  }

  loadMoreBikes(): void {
    if (this.isLoadingMore || this.allBikesLoaded) {
      return;
    }

    this.isLoadingMore = true;
    this.currentPage++;

    this.bikeService.searchBikes(this.city, this.currentPage, this.itemsPerPage).subscribe({
      next: response => {
        this.bikes = [...this.bikes, ...response.bikes];
        this.isLoadingMore = false;
        // If we got fewer results than requested, we've reached the end
        this.allBikesLoaded = response.bikes.length < this.itemsPerPage;
      },
      error: err => {
        console.error('Error loading more bikes:', err);
        this.error = 'An error occurred while loading more bikes. Please try again.';
        this.isLoadingMore = false;
      },
    });
  }
}
