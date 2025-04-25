import { Routes } from '@angular/router';
import { BikeSearchComponent } from './components/bike-search/bike-search.component';
import { BikeDetailComponent } from './components/bike-detail/bike-detail.component';

export const routes: Routes = [
  { path: '', component: BikeSearchComponent },
  { path: 'search', component: BikeSearchComponent },
  { path: 'bikes/:id', component: BikeDetailComponent },
  { path: '**', redirectTo: '' },
];
