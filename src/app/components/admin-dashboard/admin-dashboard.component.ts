import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { AdminDashboardDto } from 'src/app/models/admin-dashboard-dto.model';
import { CompanyWithUsersDto } from 'src/app/models/CompanyWithUsersDto';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{
  dashboardData?: AdminDashboardDto;
  companies: CompanyWithUsersDto[] = [];
  notifications: any[] = [];
  showNotifications = false;

  constructor(private adminService: AdminService, public router:Router) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe(data => this.dashboardData = data);
    this.adminService.getMyCompanies().subscribe(data => this.companies = data);
    this.loadNotifications();
  }

  loadNotifications():void{
    this.adminService.getNotifications().subscribe({
      next: (data) => this.notifications = data,
      error: (err) => console.error('Error loading notifications', err)
    });
  }  

  deleteCompany(companyId: number): void {
    if (confirm('Are you sure you want to delete this company?')) {
      this.adminService.deleteCompany(companyId).subscribe({
        next: () => {
          this.ngOnInit();
          alert('Company deleted successfully.');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete company.');
        }
      });
    }
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



}
