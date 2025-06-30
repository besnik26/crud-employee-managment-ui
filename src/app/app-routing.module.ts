import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';


const routes: Routes = [
  
  {path: '', component:HomeComponent},

  {
  path: 'login', component: LoginComponent
},
{
  path: 'signup', component: SignupComponent
},
{
  path: 'admin-dashboard', component: AdminDashboardComponent,
  canActivate: [authGuard]
},
{
  path: 'user-dashboard', component: UserDashboardComponent,
  canActivate: [authGuard]
}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
