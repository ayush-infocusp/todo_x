import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiResponse, todoItems } from '../models/app.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getTodoListingData(selectedFilter: string): Observable<apiResponse<todoItems[]>> {
    return this.http.get<apiResponse<todoItems[]>>('app/', {
      headers: {},
      params: {
        status: selectedFilter
      }
    });
  }
}
