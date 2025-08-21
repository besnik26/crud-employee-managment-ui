import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { NewsService } from 'src/app/services/news.service';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit{
  user: any;
  companyUsers: any[] = [];
  joinRequests: any[] = [];
  newsList: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private newsService:NewsService
  ) {}

  ngOnInit(): void {
    this.dashboardService.user$.subscribe(user => {
      this.user = user;
      if (user?.company?.id) {
        this.loadNews(user.company.id);
      }
    });   
    this.dashboardService.companyUsers$.subscribe(users => this.companyUsers = users);
    this.dashboardService.joinRequests$.subscribe(requests => this.joinRequests = requests);

    this.dashboardService.loadDashboard();
  }

  loadNews(companyId: number): void {
    this.newsService.getCompanyNews(companyId).subscribe({
      next: data => this.newsList = data,
      error: err => console.error('Error loading company news', err)
    });
  }
  
  respond(requestId: number, accepted: boolean): void {
    this.dashboardService.respondToJoinRequest(requestId, accepted);
  }
}
