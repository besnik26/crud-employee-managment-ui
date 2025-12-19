import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { JoinRequestService } from './join-request.service';
import { CompanyJoinRequest } from '../models/company-join-request.model';
import { NewsService } from './news.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private userSubject = new BehaviorSubject<any>(null);
  private companyUsersSubject = new BehaviorSubject<any[]>([]);
  private joinRequestsSubject = new BehaviorSubject<CompanyJoinRequest[]>([]);
  private newsSubject = new BehaviorSubject<any[]>([]);

  user$ = this.userSubject.asObservable();
  companyUsers$ = this.companyUsersSubject.asObservable();
  joinRequests$ = this.joinRequestsSubject.asObservable();
  news$ = this.newsSubject.asObservable();

  constructor(
    private userService: UserService,
    private newsService:NewsService
  ) {}


  loadUser(): void {
    this.userService.getUserDashboard().subscribe({
      next: user => {
        this.userSubject.next(user);
        if (user?.company?.id) {
          this.loadCompanyNews(user.company.id);
        } else {
          this.newsSubject.next([]);
        }
      },
      error: err => console.error('Error loading user dashboard', err)
    });
  }

  loadCompanyUsers(): void {
    this.userService.getCompanyUsers().subscribe({
      next: users => this.companyUsersSubject.next(users),
      error: err => {
        if (err.status === 500) {
          this.companyUsersSubject.next([]);
          console.warn('User not assigned to any company.');
        } else {
          console.error('Unexpected error loading company users:', err);
        }
      }
    });
  }

  loadCompanyNews(companyId: number): void {
    this.newsService.getCompanyNews(companyId).subscribe({
      next: news => this.newsSubject.next(news),
      error: err => console.error('Error loading company news', err)
    });
  }

}
