import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OnboardingComponent } from './onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path : 'signup',
        component : SignupComponent
      },
      {
        path : '**',
        redirectTo : 'login'
      }
    ],

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
