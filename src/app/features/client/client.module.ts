import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './client.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';


@NgModule({
  declarations: [
    DashboardComponent,
    ClientComponent
    ],
  imports: [
    FormsModule,
    CommonModule,
    ClientRoutingModule,
  ],
  providers : [
    ApiService
  ]
})
export class ClientModule { }
