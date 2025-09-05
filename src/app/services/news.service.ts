import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private baseUrl = 'http://localhost:9090/api/news';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCompanyNews(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${companyId}`, {
      headers: this.getAuthHeaders()
    });
  }

  createNews(companyId: number, news: { title: string; content: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${companyId}`, news, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  deleteNews(newsId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${newsId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
