import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { JoinRequestService } from './join-request.service';
import { CompanyJoinRequest } from '../models/company-join-request.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private userSubject = new BehaviorSubject<any>(null);
  private companyUsersSubject = new BehaviorSubject<any[]>([]);
  private joinRequestsSubject = new BehaviorSubject<CompanyJoinRequest[]>([]);

  user$ = this.userSubject.asObservable();
  companyUsers$ = this.companyUsersSubject.asObservable();
  joinRequests$ = this.joinRequestsSubject.asObservable();

  constructor(
    private userService: UserService,
    private joinRequestService: JoinRequestService
  ) {}

  loadDashboard(): void {
    this.loadUser();
    this.loadCompanyUsers();
    this.loadJoinRequests();
  }

  loadUser(): void {
    this.userService.getUserDashboard().subscribe({
      next: data => this.userSubject.next(data),
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

  loadJoinRequests(): void {
    this.joinRequestService.getPendingRequests().subscribe({
      next: requests => this.joinRequestsSubject.next(requests),
      error: err => console.error('Error loading join requests', err)
    });
  }

  respondToJoinRequest(requestId: number, accepted: boolean): void {
    this.joinRequestService.respondToRequest(requestId, accepted).subscribe({
      next: () => {
        this.loadDashboard();
      },
      error: err => console.error('Error responding to join request', err)
    });
  }
}
