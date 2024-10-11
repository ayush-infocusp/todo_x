import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  /**
   * bool to check if user is logged in 
   */
  public isLoggedInUser = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isLoggedInUser = this.authService.isUserLoggedIn;
  }

  ngOnInit(): void {
  }

  /**
   * redirect the user according to the route received in params
   * @param {string} route 
   */
  public redirectUser(route: string) {
    this.router.navigate([route]);
  }

}
