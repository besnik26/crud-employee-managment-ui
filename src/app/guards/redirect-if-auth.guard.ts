import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RedirectIfAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token && !this.authService.isTokenExpired()) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      if (role === 'ROLE_ADMIN') {
        return this.router.parseUrl('/admin-dashboard');
      } else if (role === 'ROLE_USER') {
        return this.router.parseUrl('/user-dashboard');
      }
    }

    return true; 
  }
}
