import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { RedirectIfAuthGuard } from './guards/redirect-if-auth.guard';

const routes: Routes = [
  
  {
    path: '', 
    component:HomeComponent,
    data: { hideHeader: true },
    canActivate: [RedirectIfAuthGuard]
  },
  {
    path: 'login', 
    component: LoginComponent,
    canActivate: [RedirectIfAuthGuard]
  },
  {
    path: 'signup', 
    component: SignupComponent,
    canActivate: [RedirectIfAuthGuard]
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [authGuard],
    data: { role: 'ROLE_USER' }
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
