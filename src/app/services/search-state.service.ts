import { Injectable } from '@angular/core';
import { Bike } from '../models/bike.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchStateService {
  lastSearchCity: string = '';
  searchResults: Bike[] = [];
  currentPage: number = 1;
  searchPerformed: boolean = false;
  private previousUrl: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        // If navigating directly to the root path from a non-detail page,
        // clear the search state
        if (event.urlAfterRedirects === '/' && !this.previousUrl.includes('/bikes/')) {
          this.clearSearchState();
        }

        this.previousUrl = event.urlAfterRedirects;
      });
  }

  saveSearchState(city: string, bikes: Bike[], page: number): void {
    this.lastSearchCity = city;
    this.searchResults = bikes;
    this.currentPage = page;
    this.searchPerformed = true;
  }

  clearSearchState(): void {
    this.lastSearchCity = '';
    this.searchResults = [];
    this.currentPage = 1;
    this.searchPerformed = false;
  }
}
