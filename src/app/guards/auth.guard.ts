import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  private checkAccess(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;
      const exp = payload.exp;

      const isExpired = Math.floor(Date.now() / 1000) > exp;
      if (isExpired) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }

      if (expectedRole && userRole !== expectedRole) {
        this.router.navigate([
          userRole === 'ROLE_ADMIN' ? '/admin-dashboard' : '/user-dashboard'
        ]);
        return false;
      }

      return true;
    } catch (e) {
      // Invalid token
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAccess(route);
  }
  
}
