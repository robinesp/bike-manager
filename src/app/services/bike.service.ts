import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bike, BikeSearchResponse } from '../models/bike.model';

@Injectable({
  providedIn: 'root',
})
export class BikeService {
  private apiUrl = 'https://bikeindex.org/api/v3';

  constructor(private http: HttpClient) {}

  searchBikes(
    city: string,
    page: number = 1,
    perPage: number = 25
  ): Observable<BikeSearchResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('location', city)
      .set('distance', '10')
      .set('stolenness', 'proximity');

    return this.http.get<BikeSearchResponse>(`${this.apiUrl}/search`, { params });
  }

  getBikeDetails(id: number): Observable<{ bike: Bike }> {
    return this.http.get<{ bike: Bike }>(`${this.apiUrl}/bikes/${id}`);
  }
}
