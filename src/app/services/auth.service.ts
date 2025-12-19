import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserContextService } from './user-context.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:9090/api/auth';

  constructor(private http: HttpClient, private userContext: UserContextService) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  signup(data: { 
    firstName: string; 
    lastName: string; 
    email:string; 
    phoneNumber:string; 
    password: string; 
    role: string 
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userContext.clear();
  }

  isTokenExpired(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    return (Math.floor(Date.now() / 1000) > expiry);
  } catch (e) {
    console.error('Invalid token', e);
    this.logout(); 
    return true;
  }
}

}
