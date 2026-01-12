import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { AdminDashboardDto } from 'src/app/models/admin-dashboard-dto.model';
import { CompanyWithUsersDto } from 'src/app/models/companyWithUsersDto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{
  dashboardData?: AdminDashboardDto;
  companies: CompanyWithUsersDto[] = [];
  totalEmployees = 0;

  constructor(
    private adminService: AdminService, 
    public router:Router,
    private toaster:ToastrService
  ) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe(data => this.dashboardData = data);
    this.adminService.getMyCompanies().subscribe(data => {
      this.companies = data
      this.calculateTotalEmployees(data);
    });
  }


  calculateTotalEmployees(companies: any[]): void {
    this.totalEmployees = companies.reduce((total, company) => {
      return total + company.users.length;
    }, 0);
  }

  deleteCompany(companyId: number): void {
    if (confirm('Are you sure you want to delete this company?')) {
      this.adminService.deleteCompany(companyId).subscribe({
        next: () => {
          this.ngOnInit();
          this.toaster.success('Company deleted successfully!')

        },
        error: (err) => {
          console.error(err);
          this.toaster.error('Failed to delete company!')
        }
      });
    }
  }



}
