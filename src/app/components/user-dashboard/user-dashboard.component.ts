import { Component, OnInit } from '@angular/core';
import { CompanyJoinRequest } from 'src/app/models/company-join-request.model';
import { JoinRequestService } from 'src/app/services/join-request.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {
  user: any;
  companyUsers: any[] = [];
  joinRequests: CompanyJoinRequest[] = [];


  constructor(private userService: UserService, private joinRequestService: JoinRequestService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(){
    this.loadRequests();

    this.userService.getUserDashboard().subscribe((data) => {
      this.user = data;
    });

    this.userService.getCompanyUsers().subscribe({
      next: (users) => {
        this.companyUsers = users;
      },
      error: (err) => {
        if (err.status === 500) {
          this.companyUsers = [];
          console.warn('User not assigned to any company.');
        } else {
          console.error('Unexpected error loading company users:', err);
        }
      }
    });
  }


  loadRequests() {
    this.joinRequestService.getPendingRequests().subscribe({
      next: (requests) => (this.joinRequests = requests),
      error: (err) => console.error(err),
    });
  }

  respond(requestId: number, accepted: boolean) {
    this.joinRequestService.respondToRequest(requestId, accepted).subscribe({
      next: () => this.loadDashboard(),
      error: (err) => console.error(err),
    });
  }
}
