/**
 * angular imports
 */
import { Component, OnInit } from '@angular/core';
/**
 * constant imports
 */
import { FILTER_ARRAY, FILTERS, STATUS } from 'src/app/core/constants/app.constant';
/**
 * model imports
 */
import { todoItems } from 'src/app/core/models/app.model';
import { ApiService } from 'src/app/core/services/api.service';

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
  public selectedFilter = FILTERS.ALL;

  /**
   * constants for status types
   */
  public statusConst = STATUS;

  /**
   * filter parameters
   */
  public filters = FILTER_ARRAY;
  
  /**
   * listing data for all the todo items
   */
  public listingData = [
    {
      data: 'Lorem ipsum dolor sit',
      status: this.statusConst.COMPLETED
    }, {
      data: 'amet consectetur adipisicing elit.',
      status: this.statusConst.PENDING
    }, {
      data: 'Illo sapiente veritatis rem doloremque possimus id',
      status: this.statusConst.COMPLETED
    }
  ]

  /**
   * todo Item to be added 
   */
  public newTodoItem: todoItems = { data: '', status: this.statusConst.PENDING };

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.fetchTodoData('');
  }

  /**
   * fetch todo data according to the selected filter
   */
  private fetchTodoData(selectedFilter: string): void {
    this.apiService.getTodoListingData(selectedFilter).subscribe(data => {
      this.listingData = data.dt;
    });
  }

  /**
   * add todo to the list of Todos 
   * and save to the backend
   */
  public addTodo(): void {
    if (this.newTodoItem.data != '') {
      this.newTodoItem.data.trim();
      this.listingData.push(this.newTodoItem)
      this.newTodoItem = { data: '', status: this.statusConst.PENDING };
    }
  }

  /**
   * update the todo status of a specific todo
   * @param index 
   */
  public updateTodoStatus(index: number): void {
    this.listingData[index].status = this.statusConst.COMPLETED;
  }

  /**
   * update filters and fetch the todo data accordingly
   * @param updatedFilter 
   */
  public updateFilters(updatedFilter: string): void {
    this.selectedFilter = updatedFilter;
    this.fetchTodoData(this.selectedFilter);
  }

}
