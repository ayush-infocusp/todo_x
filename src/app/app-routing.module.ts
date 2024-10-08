import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingModule } from './features/onboarding/onboarding.module';

const routes: Routes = [
  {
    path : '',
    loadChildren : () => import('../app/features/onboarding/onboarding.module').then(m => m.OnboardingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
