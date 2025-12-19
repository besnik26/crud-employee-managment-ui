import { Router } from '@angular/router';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { PanelService } from 'src/app/services/panel.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  implements OnInit{
  role = '';
  notifications: any[] = [];
  showNotifications = false;
  sidePanelOpen?:boolean;
  
  @ViewChild('notificationBtn') button!:ElementRef;
  @ViewChild('notificationPanel') panel!:ElementRef;


  constructor(
    public authService: AuthService,
    private router: Router,
    private userContext: UserContextService,
    private dashboardService: DashboardService,
    private toaster:ToastrService,
    private elementRef:ElementRef,
    private panelService:PanelService
  ) {
    this.panelService.sidePanelState$.subscribe(state => {
        this.sidePanelOpen = state;
    });
  }

  ngOnInit(): void {
    this.userContext.role$.subscribe(role => {
      this.role = role || '';
      this.userContext.notifications$.subscribe(n => this.notifications = n);
    });
  }

  toggleNotifications(): void {
    event?.stopPropagation();
    this.showNotifications = !this.showNotifications;
  }

  toggleSidePanel(): void{
    this.panelService.toggleSidePanel();
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
  onDocumentClick(event: MouseEvent) {
    if (!this.showNotifications) return;

    const clickedInsidePanel =
      this.panel?.nativeElement.contains(event.target);

    const clickedButton =
      this.button?.nativeElement.contains(event.target);

    if (!clickedInsidePanel && !clickedButton) {
      this.showNotifications = false;
    }
  }
}
