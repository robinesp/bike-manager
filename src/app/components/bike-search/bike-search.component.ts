import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BikeService } from '../../services/bike.service';
import { SearchStateService } from '../../services/search-state.service';
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
export class BikeSearchComponent implements OnInit {
  city: string = '';
  bikes: Bike[] = [];
  loading: boolean = false;
  searchPerformed: boolean = false;
  error: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  isLoadingMore: boolean = false;
  allBikesLoaded: boolean = false;

  constructor(
    private bikeService: BikeService,
    private searchStateService: SearchStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Combination of route parameters and search state
    this.route.queryParams.subscribe(params => {
      const cityFromUrl = params['city'] as string;

      if (this.searchStateService.searchPerformed) {
        this.city = this.searchStateService.lastSearchCity;
        this.bikes = this.searchStateService.searchResults as Bike[];
        this.currentPage = this.searchStateService.currentPage;
        this.searchPerformed = true;
      } else if (cityFromUrl) {
        this.city = cityFromUrl;
        this.onSearch();
      }
    });
  }

  @HostListener('window:scroll')
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

    // Update URL with search parameters without navigating
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { city: this.city },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    // Reset search state
    this.searchStateService.clearSearchState();
    this.error = null;
    this.loading = true;
    this.searchPerformed = true;
    this.currentPage = 1;
    this.allBikesLoaded = false;
    this.bikes = [];

    this.bikeService.searchBikes(this.city, this.currentPage, this.itemsPerPage).subscribe({
      next: (response: { bikes: Bike[] }) => {
        this.bikes = response.bikes;
        this.loading = false;
        this.allBikesLoaded = response.bikes.length < this.itemsPerPage;

        // Save search state
        if (this.searchStateService) {
          this.searchStateService.saveSearchState(this.city, this.bikes, this.currentPage);
        }
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
      next: (response: { bikes: Bike[] }) => {
        this.bikes = [...this.bikes, ...response.bikes];
        this.isLoadingMore = false;
        // If we got fewer results than requested, we've reached the end
        this.allBikesLoaded = response.bikes.length < this.itemsPerPage;

        // Update search state with new results
        if (this.searchStateService) {
          this.searchStateService.saveSearchState(this.city, this.bikes, this.currentPage);
        }
      },
      error: err => {
        console.error('Error loading more bikes:', err);
        this.error = 'An error occurred while loading more bikes. Please try again.';
        this.isLoadingMore = false;
      },
    });
  }
}
