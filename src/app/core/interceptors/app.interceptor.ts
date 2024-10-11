import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const baseRequest = request.clone({ url : environment.BASE_URL+request.url});
    baseRequest.headers.append('auth' , 'Bearer '+localStorage.getItem('authToken'))
    console.log(baseRequest.url);
    
    return next.handle(baseRequest);
  }
}
