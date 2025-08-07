import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserContextService } from 'src/app/services/user-context.service';
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
    private userContext: UserContextService
  ) {}

  ngOnInit(): void {
    this.userContext.role$.subscribe(role => {
      this.role = role || '';
    });

    this.userContext.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notificationId: number): void {
    this.userContext.markAsRead(notificationId);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
