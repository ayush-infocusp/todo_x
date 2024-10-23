/**
 * angular imports
 */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { retry } from 'rxjs';
import { API_URLS } from 'src/app/core/constants/api.constant';
/**
 * constant imports
 */
import { FILE_TYPE, FILTER_ARRAY, FILTERS, STATUS } from 'src/app/core/constants/app.constant';
/**
 * model imports
 */
import { todoItems } from 'src/app/core/models/app.model';
import { ApiService } from 'src/app/core/services/api.service';
import { HelperService } from 'src/app/core/services/helper.service';
import { environment } from 'src/environments/environment';


const CHUNK_SIZE = 1024 * 1024 * 3;
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
   * 
   */
  public filetypeConst = FILE_TYPE;

  /**
   * filter parameters
   */
  public filters = FILTER_ARRAY;

  /**
   * listing data for all the todo items
   */
  public listingData: todoItems[] = []

  /**
   * todo Item to be added 
   */
  public newTodoItem: todoItems = { task: '', status: this.statusConst.PENDING };

  /**
   * 
   */
  public selectedFile !: File | null
  /**
   * 
   */
  public selectedFileBlobUrl !: any
  /**
   * 
   */
  public fileType !: string | null;


  public showModal = false;

  public displayFileData !:any

  public envBaseUrl = 'send_file/'

  constructor(
    private apiService: ApiService,
    private helper: HelperService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.fetchTodoData('');
  }

  /**
   * fetch todo data according to the selected filter
   */
  public fetchTodoData(selectedFilter: string): void {
    this.apiService.getTodoListingData(selectedFilter).subscribe(data => {
      this.listingData = data.data;
    });
  }

  public addData() {
    if (this.selectedFile) {
      this.uploadFile();
    } else {
      this.addTodo();
    }
  }

  /**
   * add todo to the list of Todos 
   * and save to the backend
   */
  public addTodo(): void {
    if (this.newTodoItem.task != '') {
      this.newTodoItem.task.trim();
      this.apiService.setTodosData(this.newTodoItem).subscribe(data => {
        if (data) {
          this.listingData.push(data.data);
          this.helper.showNudge(data.message);
        }
      })
      this.newTodoItem = { task: '', status: this.statusConst.PENDING };
    }
  }

  /**
   * update the todo status of a specific todo
   * @param index 
   */
  public updateTodoStatus(todo: todoItems, index: number): void {
    if (todo.status == this.statusConst.PENDING) {
      todo.status = this.statusConst.COMPLETED
    } else {
      todo.status = this.statusConst.PENDING
    }
    this.apiService.updateTodosData(todo).subscribe(data => {
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
  public updateFilters(updatedFilter: string): void {
    this.selectedFilter = updatedFilter;
    this.fetchTodoData(this.selectedFilter == FILTERS.ALL ? '' : this.selectedFilter);
  }

  /**
   * delete the todo item
   */
  public deleteTodo(todo: todoItems): void {
    this.apiService.deleteTodosData(todo.id as number).subscribe(data => {
      if (data) {
        this.listingData = this.listingData.filter((data) => {
          return data != todo
        })
        this.helper.showNudge(data.message);
      }
    })
  }

  public onSelectFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      if (this.selectedFile)
        this.fileType = this.helper.getFileType(this.selectedFile);
    }
  }

  public async uploadFile() {
    if (this.selectedFile && this.selectedFile.size > CHUNK_SIZE) {
      await this.uploadFileMultiPart()
    } else {
      await this.uploadFileSinglePart();
    }
    this.fetchTodoData('');
  }

  public async uploadFileMultiPart() {
    if (this.selectedFile) {
      const totalChunks = Math.ceil(this.selectedFile.size / CHUNK_SIZE);
      const fileId = Date.now().toString();
      for (let i = 0; i < totalChunks; i++) {
        const chunk = this.selectedFile.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const isLastChunk = (i === totalChunks - 1);
        await this.uploadChunk(chunk, fileId, isLastChunk);
      }
      this.helper.showNudge("file uploaded");
      this.cancelFileUpload();
    }
  }

  async uploadChunk(chunk: any, fileId: string, isLastChunck: boolean, isMultipart: boolean = true) {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append("file_chunk", chunk, this.selectedFile?.name);
      formData.append('file_id', fileId);
      formData.append('is_last_chunk', isLastChunck.toString());
      formData.append('is_multipart', 'true');
      formData.append('file_type', this.helper.getFileType(this.selectedFile))
      await this.http.put(API_URLS.UPLOAD_FILE, formData, { reportProgress: true, observe: 'response' }).pipe(retry(1)).toPromise();
    }
  }

  public async uploadFileSinglePart(): Promise<void> {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append("file_chunk", this.selectedFile, this.selectedFile?.name);
      formData.append('file_id', this.selectedFile.name);
      formData.append('is_last_chunk', 'true');
      formData.append('is_multipart', 'false');
      formData.append('file_type', this.helper.getFileType(this.selectedFile))
      await this.http.put(API_URLS.UPLOAD_FILE, formData, {
        reportProgress: true,
        observe: 'response'
      }).subscribe(response => {
        console.log('File uploaded successfully:', response);
      },
        error => {
          console.error('Error uploading file:', error);
        });
    }
  }

  public cancelFileUpload() {
    this.selectedFile = null;
    this.selectedFileBlobUrl = null
    this.fileType = null
  }

  public fileData !:any;
  public showFile(fileData : any){
    this.showModal =  !this.showModal;
    this.displayFileData = fileData
    this.getSrc(this.envBaseUrl+this.displayFileData.task)
    this.fileData = URL.createObjectURL(this.fileData)
  }


  async getSrc(url : string){
    await this.http.get(url,{responseType  : 'blob'}).subscribe(data => {
      if(data) {
        console.log(data,data.type);
        console.log('Instance of Blob:', data instanceof Blob);

        this.fileData = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data ))
      }
    })
  }
}
