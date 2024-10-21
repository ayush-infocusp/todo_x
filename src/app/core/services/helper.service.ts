import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FILE_TYPE } from '../constants/app.constant';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private messageService: MessageService) {}

  public toggleHeaders = new BehaviorSubject(false);


  showNudge(message : string){
      this.messageService.add({severity:'info', summary: 'Info', detail: message});
  }

  public getFileType(file : File) {
    const fileType = file.type;
    switch (true) {
        case fileType.startsWith('audio/'):
            return FILE_TYPE.AUDIO;
        case fileType.startsWith('video/'):
            return FILE_TYPE.VIDEO;
        default:
            return FILE_TYPE.TEXT;
    }
}


}
