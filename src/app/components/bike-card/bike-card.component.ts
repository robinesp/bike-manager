import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { Bike } from '../../models/bike.model';

@Component({
  selector: 'app-bike-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './bike-card.component.html',
})
export class BikeCardComponent {
  @Input() bike!: Bike;
}
