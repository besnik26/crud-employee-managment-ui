import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDashboardDto } from '../models/admin-dashboard-dto.model';
import { CompanyWithUsersDto } from '../models/CompanyWithUsersDto';
import { UserDto } from '../models/userDto';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = 'http://localhost:9090/api/companies';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
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
}
