import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BikeService } from '../../services/bike.service';
import { SearchStateService } from '../../services/search-state.service';
import { Bike } from '../../models/bike.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-bike-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatListModule,
    MatDividerModule,
    NgOptimizedImage,
  ],
  templateUrl: './bike-detail.component.html',
})
export class BikeDetailComponent implements OnInit {
  bike: Bike | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bikeService: BikeService,
    private searchStateService: SearchStateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bikeId = params.get('id');
      if (bikeId) {
        this.fetchBikeDetails(+bikeId);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  fetchBikeDetails(id: number): void {
    this.loading = true;

    this.bikeService.getBikeDetails(id).subscribe({
      next: response => {
        this.bike = response.bike;
        this.loading = false;
      },
      error: err => {
        console.error('Error fetching bike details:', err);
        this.error = 'Failed to load bike details. Please try again.';
        this.loading = false;
      },
    });
  }

  goBack(): void {
    // If there's a previous search, go back to home page with search results
    if (this.searchStateService && this.searchStateService.searchPerformed) {
      this.router.navigate(['/search'], {
        queryParams: { city: this.searchStateService.lastSearchCity },
      });
    } else {
      // If no previous search, just go to home page
      this.router.navigate(['/']);
    }
  }
}
