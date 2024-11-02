/**
 * angular imports
 */
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { retry } from 'rxjs';
import { API_URLS } from 'src/app/core/constants/api.constant';
/**
 * constant imports
 */
import { FILE_TYPE, FILTER_ARRAY, FILTERS, RECORDING_TYPE, STATUS } from 'src/app/core/constants/app.constant';
/**
 * model imports
 */
import { todoItems } from 'src/app/core/models/app.model';
import { ApiService } from 'src/app/core/services/api.service';
import { HelperService } from 'src/app/core/services/helper.service';
import { environment } from 'src/environments/environment';


import * as RecordRTC from 'recordrtc';
import { AudioRecordingService } from 'src/app/core/services/audio-recording-service.service';
import { VideoRecordingService } from 'src/app/core/services/video-recording-service.service';



const CHUNK_SIZE = 1024 * 1024 * 5;
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
   * recording type 
   */
  public recordingTypeConst = RECORDING_TYPE;

  /**
   * listing data for all the todo items
   */
  public listingData: todoItems[] = []

  /**
   * todo Item to be added 
   */
  public newTodoItem: todoItems = { task: '', status: this.statusConst.PENDING };

  /**
   * file whcih is selected to be uploaded
   */
  public selectedFile !: File | null
  /**
   * blob url used to render the selected file
   */
  public selectedFileBlobUrl !: any
  /**
   * file type
   */
  public fileType !: string | null;
  /**
   * show modal for the data render
   */
  public showModal = false;
  /**
   * 
   */
  public displayFileData !: any
  /**
   * 
   */
  public envBaseUrl = 'send_file/'

  /**
   * bool for the type of recording
   */
  public isVideoRecording = false;
  public isAudioRecording = false;
  /**
   * is a
   */
  isRecording = false;
  recordedTime !: any;
  blobUrl !: any;

  @ViewChild('videoRecorder') videoRecorder: any
  videoStream!: MediaStream;
  videoBlobUrl!: any;
  videoBlob!: any;
  videoName!: any;
  videoRecordedTime!: any


  constructor(
    private apiService: ApiService,
    private helper: HelperService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private videoRecordingService: VideoRecordingService
  ) { }

  ngOnInit(): void {
    this.fetchTodoData('');
    this.initVideoObs();
    this.initAudioObs();
  }

  /**
   * initialise the video observables
   */
  initVideoObs() {
    this.videoRecordingService.recordingFailed().subscribe(() => {
      this.isVideoRecording = false;
      this.ref.detectChanges();
    });

    this.videoRecordingService.getRecordedTime().subscribe((time) => {
      this.videoRecordedTime = time;
      this.ref.detectChanges();
    });

    this.videoRecordingService.getStream().subscribe((stream) => {
      this.videoStream = stream;
      this.ref.detectChanges();
    });

    this.videoRecordingService.getRecordedBlob().subscribe((data) => {
      this.videoBlob = data.blob;
      this.videoName = data.name;
      this.selectedFile = new File([data.blob],this.helper.getRandomFileName("record_")+".wav",{
        type : "video/wav"
      })
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });

  }

  initAudioObs() {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.selectedFile = new File([data.blob],this.helper.getRandomFileName("record_")+".mp3",{
        type : "audio/mp3"
      })
      console.log(this.selectedFile);
      
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.isAudioRecording = false;
    });
  }


  // ngAfterViewInit() {
  //   // set the initial state of the video
  //   let video: HTMLVideoElement = this.videoRecorder.nativeElement.nativeElement;
  //   video.muted = false;
  //   video.controls = false;
  //   video.autoplay = false;
  // }

  /**
   * fetch todo data according to the selected filter
   */
  public fetchTodoData(selectedFilter: string): void {
    this.apiService.getTodoListingData(selectedFilter).subscribe(data => {
      console.log(data.data)
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
      console.log(file)
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
      await this.http.put(API_URLS.UPLOAD_FILE, formData, { reportProgress: true, observe: 'response' }).pipe(retry(1)).subscribe(data => {
        if (data && isLastChunck) {
          this.fetchTodoData('');
        }
      });
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
        this.fetchTodoData('');
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

  public fileData !: any;
  public showFile(fileData: any) {
    this.showModal = !this.showModal;
    this.displayFileData = fileData
    this.getSrc(this.envBaseUrl + this.displayFileData.task)
    this.fileData = URL.createObjectURL(this.fileData)
  }


  async getSrc(url: string) {
    await this.http.get(url, { responseType: 'blob' }).subscribe(data => {
      if (data) {
        console.log(data, data.type);
        console.log('Instance of Blob:', data instanceof Blob);

        this.fileData = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
      }
    })
  }


  /**
   * 
   * RECORD AUDIO & VIDEO
   * 
   * 
   */


  startRecording(recordingType: string) {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  async stopRecording() {
    if (this.isAudioRecording) {
      await this.audioRecordingService.stopRecording();
      // this.isAudioRecording = false;
    }
  }



  /**
   * 
   */
  startVideoRecording() {
    if (!this.isVideoRecording) {
      this.isVideoRecording = true;
      setTimeout(() => {
        this.videoRecorder.nativeElement.controls = false;
        this.videoRecordingService.startRecording()?.then(stream => {
          // this.videoRecorder.nativeElement.src = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
          this.videoRecorder.nativeElement.srcObject = stream;
          this.videoRecorder.nativeElement.play();
        })
          .catch(function (err) {
            console.log(err.name + ": " + err.message);
          });
      }, 500);
    }
  }

  abortVideoRecording() {
    if (this.isVideoRecording) {
      this.isVideoRecording = false;
      this.videoRecordingService.abortRecording();
      this.videoRecorder.nativeElement.controls = false;
    }
  }

  stopVideoRecording() {
    if (this.isVideoRecording) {
      this.videoRecordingService.stopRecording();
      this.videoRecorder.nativeElement.srcObject = this.videoBlobUrl;
      this.isVideoRecording = false;
      this.videoRecorder.nativeElement.controls = true;
    }
  }

  clearVideoRecordedData() {
    this.videoBlobUrl = null;
    this.videoRecorder.nativeElement.srcObject = null;
    this.videoRecorder.nativeElement.controls = false;
    this.ref.detectChanges();
  }

  downloadVideoRecordedData() {
    this._downloadFile(this.videoBlob, 'video/mp4', this.videoName);
  }


  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    //this.video.srcObject = stream;
    //const url = data;
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }


  clearRecordedData() {
    this.blobUrl = null;
    if (this.videoBlobUrl)
      this.clearVideoRecordedData();
  }

  download() {

  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
