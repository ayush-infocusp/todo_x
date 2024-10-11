import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from 'src/app/core/constants/app.constant';
import { loginUserDetails } from 'src/app/core/models/app.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  public loginForm = this.fb.group({
    email: ['', [Validators.required,Validators.email]],
    password: ['', Validators.required]
  })

  ngOnInit(): void {
  }

  /**
   * login user with the valid creds
   */
  public loginUser(): void {    
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value as loginUserDetails).subscribe(data => {
        if (data) {
          localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, data.dt.token)
          this.router.navigate(['/app/dashboard'])
        }
      })
    }
  }

}
