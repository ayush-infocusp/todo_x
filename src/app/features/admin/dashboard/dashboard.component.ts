/**
 * angular imports
 */
import { Component, OnInit } from '@angular/core';
/**
 * constant imports
 */
import { FILTER_ARRAY, FILTERS, STATUS, USER_FILTER, USER_FILTER_ARRAY } from 'src/app/core/constants/app.constant';
/**
 * model imports
 */
import { todoItems, userItems } from 'src/app/core/models/app.model';
import { ApiService } from 'src/app/core/services/api.service';
import { HelperService } from 'src/app/core/services/helper.service';

/**
 * dashboard acts as the first interface to the client 
 * to render the todo-items and to save the todo individually 
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /**
   * selected Filter
   * intial value to be ALL
   */
  public selectedFilter = USER_FILTER.ACTIVE;

  /**
   * constants for status types
   */
  public statusConst = STATUS;

  /**
   * filter parameters
   */
  public filters = USER_FILTER_ARRAY;

  /**
   * listing data for all the todo items
   */
  public listingData: userItems[] = []

  /**
   * todo Item to be added 
   */
  public newTodoItem: todoItems = { task: '', status: this.statusConst.PENDING };

  constructor(
    private apiService: ApiService,
    private helper: HelperService,
  ) { }

  ngOnInit(): void {
    this.fetchUserData(this.selectedFilter);
  }

  /**
   * fetch todo data according to the selected filter
   */
  private fetchUserData(selectedFilter:{key : string, delete :boolean}): void {
    this.apiService.getUserListingData(1,20,selectedFilter.delete).subscribe(data => {
      this.listingData = data.data;
    });
  }

  /**
   * add todo to the list of Todos 
   * and save to the backend
   */
  // public addTodo(): void {
  //   if (this.newTodoItem.task != '') {
  //     this.newTodoItem.task.trim();
  //     this.apiService.setTodosData(this.newTodoItem).subscribe(data => {
  //       if (data) {
  //         this.listingData.push(data.data);
  //         this.helper.showNudge(data.message);
  //       }
  //     })
  //     this.newTodoItem = { task: '', status: this.statusConst.PENDING };
  //   }
  // }

  /**
   * update the todo status of a specific todo
   * @param index 
   */
  public updateTodoStatus(todo: todoItems, index: number): void {
    if(todo.status == this.statusConst.PENDING){
      todo.status = this.statusConst.COMPLETED
    }else{
      todo.status = this.statusConst.PENDING
    }
    this.apiService.updateUserData(todo).subscribe(data => {
      if (data) {
        this.listingData[index] = data.data;
        this.helper.showNudge(data.message);
      }
    })
  }

  /**
   * update filters and fetch the todo data accordingly
   * @param updatedFilter 
   */
  public updateFilters(updatedFilter:{key : string, delete :boolean}): void {
    this.selectedFilter = updatedFilter;
    this.fetchUserData(this.selectedFilter);
  }

  /**
   * delete the todo item
   */
  public deleteUser(user: userItems): void {
    this.apiService.deleteUserData(user.id as number).subscribe(data => {
      if (data){
        this.listingData = this.listingData.filter((data) => {
          return data != user
        })
        this.helper.showNudge(data.message);
      }
    })
  }

}
