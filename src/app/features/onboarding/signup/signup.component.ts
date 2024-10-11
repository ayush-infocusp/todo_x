import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from 'src/app/core/constants/app.constant';
import { loginUserDetails } from 'src/app/core/models/app.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  public signupForm = this.fb.group({
    username : ['',Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  })

  ngOnInit(): void {
  }

  /**
   * 
   */
  public signupUser(): void {
    if (this.signupForm.value.confirmPassword == this.signupForm.value.password &&  this.signupForm.valid) {
      this.authService.signUpUser(this.signupForm.value as loginUserDetails).subscribe(data => {
        if (data) {
          localStorage.setItem(LOCAL_STORAGE.AUTH_TOKEN, data.dt.token)
          localStorage.setItem(LOCAL_STORAGE.USER_INFO, JSON.stringify(data.dt.user))
          this.router.navigate(['/app/dashboard'])
        }
      })
    }
  }

}
