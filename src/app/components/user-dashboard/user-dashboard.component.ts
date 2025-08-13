import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit{
  user: any;
  companyUsers: any[] = [];
  joinRequests: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.user$.subscribe(user => this.user = user);
    this.dashboardService.companyUsers$.subscribe(users => this.companyUsers = users);
    this.dashboardService.joinRequests$.subscribe(requests => this.joinRequests = requests);

    this.dashboardService.loadDashboard();
  }

  respond(requestId: number, accepted: boolean): void {
    this.dashboardService.respondToJoinRequest(requestId, accepted);
  }
}
