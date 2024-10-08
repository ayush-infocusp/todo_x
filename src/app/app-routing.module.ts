import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard/auth.guard';

const routes: Routes = [
  {
    path : 'app',
    canActivate: [AuthGuard],
    loadChildren : () => import('../app/features/client/client.module').then(m => m.ClientModule),
    
  },
  {
    path : 'admin',
    canActivate: [AuthGuard],
    loadChildren : () => import('../app/features/admin/admin.module').then(m => m.AdminModule),
    
  },
  {
    path : '',
    canActivate: [AuthGuard],
    loadChildren : () => import('../app/features/onboarding/onboarding.module').then(m => m.OnboardingModule),
    
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
