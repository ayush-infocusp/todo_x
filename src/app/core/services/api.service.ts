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

  /**
   * get the todo listing data
   * @param {string} selectedFilter 
   * @param {number} pageNo
   * @param {number} pageSize
   * @returns 
   */
  public getTodoListingData(selectedFilter: string, pageNo: number = 1, pageSize: number = 10): Observable<apiResponse<todoItems[]>> {
    return this.http.get<apiResponse<todoItems[]>>('app/getTodos/', {
      params: {
        status: selectedFilter,
        pageNo: pageNo,
        pageSize: pageSize
      }
    });
  }

  /**
   * set the todos item in backend
   * @param {todoItems} todo 
   * @returns 
   */
  public setTodosData(todo: todoItems): Observable<apiResponse<todoItems>> {
    return this.http.post<apiResponse<todoItems>>('app/setTodos', {
      body: todo
    })
  }

  /**
   * update the status of the todos item
   * @param {todoItems} todo
   * @returns 
   */
  public updateTodosData(todo: todoItems): Observable<apiResponse<todoItems>> {
    return this.http.patch<apiResponse<todoItems>>('app/updateTodos', {
      body: todo
    })
  }

  /**
   * delete the todos based on their index
   * @param {number} todoItemIndex 
   * @returns 
   */
  public deleteTodosData(todoItemIndex: number): Observable<apiResponse<todoItems>> {
    return this.http.delete<apiResponse<todoItems>>('api/deleteTodos/' + todoItemIndex);
  }
}
