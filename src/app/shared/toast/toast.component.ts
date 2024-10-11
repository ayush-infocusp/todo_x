import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for toast animations
import {ToastModule} from 'primeng/toast';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers : [
  ],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {  

}
