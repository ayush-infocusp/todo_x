import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListComponent } from './list/list.component';
import { ClientComponent } from './client.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ListComponent,
    ClientComponent
    ],
  imports: [
    CommonModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
