import { Router } from '@angular/router';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
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
    private dashboardService: DashboardService,
    private toaster:ToastrService,
    private elementRef:ElementRef
  ) {}

  ngOnInit(): void {
    this.userContext.role$.subscribe(role => {
      this.role = role || '';
      this.userContext.notifications$.subscribe(n => this.notifications = n);
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notificationId: number): void {
      this.userContext.markAsRead(notificationId);
  }

  respond(requestId: number, accepted: boolean): void {
    if (this.role === 'user') {
      this.userContext.respondToJoinRequest(requestId, accepted);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toaster.info('Logged out successfully!')
  }

  @HostListener('document:click', ['$event'])
  ClickOut(event: MouseEvent) {
    const isClickedOutside = !this.elementRef.nativeElement.contains(
      event.target as Node
    );
    if (isClickedOutside) {
      this.showNotifications = false;
    }
  }
}
