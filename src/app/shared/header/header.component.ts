import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  implements OnInit{
  role = '';
  notifications: any[] = [];
  showNotifications = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private userContext: UserContextService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.userContext.role$.subscribe(role => {
      this.role = role || '';

      if (this.role === 'admin') {
        this.userContext.notifications$.subscribe(n => this.notifications = n);
      } else if (this.role === 'user') {
        this.dashboardService.joinRequests$.subscribe(r => this.notifications = r);
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notificationId: number): void {
    if (this.role === 'admin') {
      this.userContext.markAsRead(notificationId);
    }
  }

  respond(requestId: number, accepted: boolean): void {
    if (this.role === 'user') {
      this.dashboardService.respondToJoinRequest(requestId, accepted);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
