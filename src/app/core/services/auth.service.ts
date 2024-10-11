import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiResponse, loginUserDetails, signupResponse, tokenData, userDetails } from '../models/app.model';
import { API_URLS } from '../constants/api.constant';
import { LOCAL_STORAGE } from '../constants/app.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isUserLoggedIn = false;

  constructor(
    private http: HttpClient
  ) {
    this.userLoggedIn();
  }

  private userLoggedIn() {
    this.isUserLoggedIn = localStorage.getItem(LOCAL_STORAGE.AUTH_TOKEN) ? true : false;
  }

  /**
 * login with the userDetails
 * @param {userDetails} userDetails 
 * @returns 
 */
  public loginUser(userDetails: loginUserDetails): Observable<apiResponse<tokenData>> {
    return this.http.post<apiResponse<tokenData>>(API_URLS.LOGIN, userDetails)
  }


  /**
  * signup with the userDetails
  * @param {userDetails} userDetails 
  * @returns 
  */
  public signUpUser(userDetails: loginUserDetails): Observable<apiResponse<signupResponse>> {
    return this.http.post<apiResponse<signupResponse>>(API_URLS.SIGNUP, userDetails)
  }
}
