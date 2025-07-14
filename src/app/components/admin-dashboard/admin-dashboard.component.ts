import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { AdminDashboardDto } from 'src/app/models/admin-dashboard-dto.model';
import { CompanyWithUsersDto } from 'src/app/models/CompanyWithUsersDto';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{
  dashboardData?: AdminDashboardDto;
  companies: CompanyWithUsersDto[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe(data => this.dashboardData = data);
    this.adminService.getMyCompanies().subscribe(data => this.companies = data);
  }

}
