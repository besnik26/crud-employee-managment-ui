import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { JoinRequestService } from 'src/app/services/join-request.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent {
  companyId!: number;
  userIdToInvite: number = 0;
  newsMessage = '';
  joinRequestMessage = '';
  company: any;
  users: any[] = [];
  userIdToAssign!: number;
  newsList: any[] = [];

  // form model
  newNews = { title: '', content: '' };


  constructor(
    private route: ActivatedRoute, 
    private adminService: AdminService, 
    private joinRequestService: JoinRequestService,
    private newsService:NewsService
  ) {}

  ngOnInit(): void {
    this.companyId = +this.route.snapshot.paramMap.get('companyId')!;
    this.getCompanyInfo();
    this.getCompanyUsers();
    this.loadNews();
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
        this.joinRequestMessage = 'Join request sent successfully.';
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error?.includes("already exists")) {
          this.joinRequestMessage = "This user already has a pending request.";
        } else {
          this.joinRequestMessage = "Error sending request.";
        }
        console.error(err);
      }
    });
  }

  loadNews(): void {
    this.newsService.getCompanyNews(this.companyId).subscribe({
      next: data => this.newsList = data,
      error: err => console.error('Error fetching news', err)
    });
  }

  publishNews(): void {
    if (!this.newNews.title || !this.newNews.content) return;

    this.newsService.createNews(this.companyId, this.newNews).subscribe({
      next: () => {
        this.newsMessage = 'News published successfully!';
        this.newNews = { title: '', content: '' };
        this.loadNews();
      },
      error: err => console.error('Error publishing news', err)
    });
  }

  deleteNews(newsId: number): void {
    if (confirm('Are you sure you want to delete this news?')) {
      this.newsService.deleteNews(newsId).subscribe({
        next: () => {
          this.newsList = this.newsList.filter(n => n.id !== newsId); // update UI 
          this.newsMessage = 'News deleted successfully!';
        },
        error: err => console.error('Error deleting news', err)
      });
    }
  }
}
