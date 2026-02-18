import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AdminDashboardDto } from '../models/admin-dashboard-dto.model';
import { CompanyWithUsersDto } from '../models/companyWithUsersDto';
import { UserDto } from '../models/userDto';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private companyRefresh$ = new BehaviorSubject<void>(undefined);
  companyRefreshTrigger$ = this.companyRefresh$.asObservable();

  triggerCompanyRefresh() {
    this.companyRefresh$.next();
  }

  getDashboard(): Observable<AdminDashboardDto> {
    return this.http.get<AdminDashboardDto>(`${this.baseUrl}/admin/dashboard`, {
      headers: this.getAuthHeaders()
    });
  }

  getMyCompanies(): Observable<CompanyWithUsersDto[]> {
    return this.http.get<CompanyWithUsersDto[]>(`${this.baseUrl}/my-companies`, {
      headers: this.getAuthHeaders()
    });
  }


  getUsersByCompany(companyId: number): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/${companyId}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  addCompany(data: { name: string; industry: string; location: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(()=> this.triggerCompanyRefresh())
    )
  }

  updateCompany(companyId: number, companyData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${companyId}`, companyData);
  }

  getCompanyById(companyId: number): Observable<CompanyWithUsersDto> {
    return this.http.get<CompanyWithUsersDto>(`${this.baseUrl}/${companyId}`);
  }

  getCompanyUsers(companyId: number) {
    return this.http.get<any[]>(`http://localhost:9090/api/users/company/${companyId}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCompany(companyId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${companyId}`, { responseType: 'text' })
      .pipe(
        tap(() => this.triggerCompanyRefresh())
      );
  }
  
  removeUserFromCompany(companyId: number, userId: number) {
    return this.http.put(`${this.baseUrl}/${companyId}/remove-user/${userId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
  

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:9090/api/notifications', {
      headers: this.getAuthHeaders()
    });
  }

  markNotificationAsRead(id: number): Observable<any> {
    return this.http.post<any>(`http://localhost:9090/api/notifications/mark-read/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

}
