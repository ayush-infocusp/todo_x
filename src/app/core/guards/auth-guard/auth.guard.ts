import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE } from '../../constants/app.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    const authToken = localStorage.getItem(LOCAL_STORAGE.AUTH_TOKEN);
    return true 
    // authToken ? true : false;
  }
  
}
