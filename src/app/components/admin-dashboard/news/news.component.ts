import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { NewsService } from 'src/app/services/news.service';
import { takeUntil, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewsModalComponent } from '../news-modal/news-modal.component';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); 
  companyId!: number;
  company: any;
  newsList: any[] = [];
  newNews = { title: '', content: '' };


  constructor(
    private route:ActivatedRoute,
    private adminService:AdminService,
    private newsService:NewsService,
    private toaster:ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.companyId = +params.get('companyId')!;
      this.getCompanyInfo();
      this.loadNews();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDialog(){
    const dialogRef = this.dialog.open(NewsModalComponent, {
      width: '400px',
      data:{companyId: this.companyId}
    });
    dialogRef.afterClosed().subscribe(result => {
    if(result === 'submitted') {
      this.loadNews();  
    }
  });
  }

  getCompanyInfo():void{
    this.adminService.getCompanyById(this.companyId).pipe(takeUntil(this.destroy$)).subscribe(
      data => this.company = data,
      err => {
        console.error('Error fetching company', err)
        this.toaster.error('Error fetching company')
      }
    )
  }

  loadNews(): void {
    this.newsService.getCompanyNews(this.companyId).pipe(takeUntil(this.destroy$)).subscribe({
      next: data => this.newsList = data,
      error: err => {
        console.error('Error fetching news', err)
        this.toaster.error('Error fetching news')
      }
    });
  }

  publishNews(): void {
    if (!this.newNews.title || !this.newNews.content) return;

    this.newsService.createNews(this.companyId, this.newNews).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.toaster.success('News published successfully!')
        this.newNews = { title: '', content: '' };
        this.loadNews();
      },
      error: err =>{ 
        console.error('Error publishing news', err)
        this.toaster.error('Error publishing news')
      }
    });
  }

  deleteNews(newsId: number): void {
    if (confirm('Are you sure you want to delete this news?')) {
      this.newsService.deleteNews(newsId).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.newsList = this.newsList.filter(n => n.id !== newsId); // update UI 
          this.toaster.info('News deleted successfully!')
        },
        error: err => {
          console.error('Error deleting news', err)
          this.toaster.error('Error deleting news')
        }
      });
    }
  }
}
