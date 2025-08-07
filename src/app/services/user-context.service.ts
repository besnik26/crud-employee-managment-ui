import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from './admin.service';

@Injectable({ providedIn: 'root' })
export class UserContextService {
    private roleSubject = new BehaviorSubject<string | null>(this.extractRoleFromToken());
  private notificationsSubject = new BehaviorSubject<any[]>([]);

  role$ = this.roleSubject.asObservable();
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private adminService: AdminService) {
    this.refreshNotifications(); // load if admin
  }

  setRoleFromToken(): void {
    const role = this.extractRoleFromToken();
    this.roleSubject.next(role);
    if (role === 'admin') this.refreshNotifications();
    else this.notificationsSubject.next([]); // clear if not admin
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
    if (this.roleSubject.value === 'admin') {
      this.adminService.getNotifications().subscribe({
        next: data => this.notificationsSubject.next(data),
        error: err => console.error('Error loading notifications', err)
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

  clear(): void {
    this.roleSubject.next(null);
    this.notificationsSubject.next([]);
  }
}