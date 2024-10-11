import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiResponse, todoItems } from '../models/app.model';
import { Observable } from 'rxjs';
import { API_URLS } from '../constants/api.constant';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * get the todo listing data
   * @param {string} selectedFilter 
   * @param {number} pageNo
   * @param {number} pageSize
   * @returns 
   */
  public getTodoListingData(selectedFilter: string, pageNo: number = 1, pageSize: number = 10): Observable<apiResponse<todoItems[]>> {
    return this.http.get<apiResponse<todoItems[]>>(API_URLS.GET_TODOS, {
      params: {
        pageNo: pageNo,
        pageSize: pageSize,
        status: selectedFilter,
      }
    });
  }

  /**
   * set the todos item in backend
   * @param {todoItems} todo 
   * @returns 
   */
  public setTodosData(todo: todoItems): Observable<apiResponse<todoItems>> {
    return this.http.post<apiResponse<todoItems>>(API_URLS.SET_TODOS, todo)
  }

  /**
   * update the status of the todos item
   * @param {todoItems} todo
   * @returns 
   */
  public updateTodosData(todo: todoItems): Observable<apiResponse<todoItems>> {
    return this.http.patch<apiResponse<todoItems>>(API_URLS.UPDATE_TODOS, todo)
  }

  /**
   * delete the todos based on their index
   * @param {number} todoItemIndex 
   * @returns 
   */
  public deleteTodosData(todoItemIndex: number): Observable<apiResponse<todoItems>> {
    return this.http.delete<apiResponse<todoItems>>(API_URLS.DELETE_TODOS + '/' + todoItemIndex);
  }
}
