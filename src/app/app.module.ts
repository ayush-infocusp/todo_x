import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppInterceptor } from './core/interceptors/app.interceptor';
import { ToastComponent } from './shared/toast/toast.component';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NavbarComponent,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastComponent
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
