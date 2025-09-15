import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from './admin.service';
import { JoinRequestService } from './join-request.service';
import { DashboardService } from './dashboard.service';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private roleSubject = new BehaviorSubject<string | null>(this.extractRoleFromToken());
  private notificationsSubject = new BehaviorSubject<any[]>([]);

  role$ = this.roleSubject.asObservable();
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private adminService: AdminService, private joinRequestService: JoinRequestService, private dashboardService:DashboardService) {
    this.refreshNotifications(); // load if admin
      setInterval(() => this.refreshNotifications(), 60000);

  }

   setRoleFromToken(): void {
    const role = this.extractRoleFromToken();
    this.roleSubject.next(role);
    this.refreshNotifications();
  }

  private extractRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'ROLE_ADMIN' ? 'admin' : 'user';
    } catch (e) {
      return null;
    }
  }

  refreshNotifications(): void {
    const role = this.roleSubject.value;

    if (role === 'admin') {
      this.adminService.getNotifications().subscribe({
        next: data => this.notificationsSubject.next(data),
        error: err => console.error('Error loading admin notifications', err)
      });
    } 
    else if (role === 'user') {
      this.adminService.getNotifications().subscribe({
        next: data => this.notificationsSubject.next(data),
        error: err => console.error('Error loading user notifications', err)
      });
    }
  }

  markAsRead(notificationId: number): void {
  this.adminService.markNotificationAsRead(notificationId).subscribe({
    next: () => {
      const updated = this.notificationsSubject.value.filter(n => n.id !== notificationId);
      this.notificationsSubject.next(updated);
    },
    error: err => console.error('Error marking notification as read', err)
  });
}

  respondToJoinRequest(requestId: number, accepted: boolean): void {
  if (this.roleSubject.value === 'user') {
    this.joinRequestService.respondToRequest(requestId, accepted).subscribe({
      next: () => {
        console.log("Join request response successful");
        this.dashboardService.loadDashboard();
        this.refreshNotifications();
      },
      error: err => console.error("Error responding to join request", err)
    });
  }
}

  clear(): void {
    this.roleSubject.next(null);
    this.notificationsSubject.next([]);
  }
}