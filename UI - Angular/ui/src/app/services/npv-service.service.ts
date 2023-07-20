import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestModel } from '../models/request.model';
import { ResultModel } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class NpvServiceService {

  private apiUrl = 'https://localhost:7284/calculatenpv'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  postData(request: RequestModel): Observable<ResultModel[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<ResultModel[]>(this.apiUrl, request, { headers });
  }
}
