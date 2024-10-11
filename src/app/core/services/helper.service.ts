import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private messageService: MessageService) {}


  showNudge(message : string){
      this.messageService.add({severity:'info', summary: 'Info', detail: message});
  }


}
