import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { JoinRequestService } from 'src/app/services/join-request.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent {
  companyId!: number;
  userIdToInvite: number = 0;
  message = '';
  company: any;
  users: any[] = [];
  userIdToAssign!: number;


  constructor(
    private route: ActivatedRoute, 
    private adminService: AdminService, 
    private joinRequestService: JoinRequestService
  ) {}

  ngOnInit(): void {
    this.companyId = +this.route.snapshot.paramMap.get('companyId')!;
    this.getCompanyInfo();
    this.getCompanyUsers();
  }

  getCompanyInfo(): void {
    this.adminService.getCompanyById(this.companyId).subscribe(
      data => this.company = data,
      err => console.error('Error fetching company', err)
    );
  }

  getCompanyUsers(): void {
    this.adminService.getCompanyUsers(this.companyId).subscribe(
      data => this.users = data,
      err => console.error('Error fetching users', err)
    );
  }

  removeUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.removeUserFromCompany(this.companyId, userId).subscribe({
        next: () => this.getCompanyUsers(),
        error: err => console.error('Error removing user', err)
      });
    }
  }

  sendRequest() {
    this.joinRequestService.sendJoinRequest(this.userIdToInvite, this.companyId).subscribe({
      next: () => {
        this.message = 'Join request sent successfully.';
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error?.includes("already exists")) {
          this.message = "This user already has a pending request.";
        } else {
          this.message = "Error sending request.";
        }
        console.error(err);
      }
    });
  }
}
