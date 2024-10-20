import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LOCAL_STORAGE } from '../constants/app.constant';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const baseRequest = request.clone({ 
      url : environment.BASE_URL+request.url,
      setHeaders : {
        // 'Content-Type': 'multipart/form-data;',
        // 'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE.AUTH_TOKEN)}`,
      }
    });
    console.log(baseRequest);
    
    return next.handle(baseRequest);
  }
}
