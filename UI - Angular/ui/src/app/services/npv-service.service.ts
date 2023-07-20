import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NpvServiceService {

  private apiUrl = 'https://localhost:7284/calculatenpv'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  postData(data: { upper: number, lower: number, rateIncrement: number, cashFlows: number[] }): Observable<{ npv: number, rate: number }[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ npv: number, rate: number }[]>(this.apiUrl, data, { headers });
  }

}
