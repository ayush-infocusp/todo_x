import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OnboardingComponent } from './onboarding.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    OnboardingComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    CommonModule,
    OnboardingRoutingModule
  ]
})
export class OnboardingModule { }
