import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';

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
    private adminService: AdminService
  ){}


  ngOnInit(): void {
    const token =  localStorage.getItem('token');
    if(token){
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;
      if (role === 'ROLE_ADMIN') {
        this.role = 'admin'
        this.loadNotifications();
      } else if (role === 'ROLE_USER') {
        this.role = 'user'
      }
    }
  }

  loadNotifications():void{
    this.adminService.getNotifications().subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error('Error loading notifications', err)
    });
  }

   markAsRead(notificationId: number): void {
    this.adminService.markNotificationAsRead(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
      },
      error: (err) => {
        console.error('Failed to mark notification as read', err);
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
