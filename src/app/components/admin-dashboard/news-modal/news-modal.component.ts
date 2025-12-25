import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from 'src/app/services/news.service';
import { takeUntil, Subject } from 'rxjs';


@Component({
  selector: 'app-news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.scss']
})
export class NewsModalComponent implements OnDestroy{
    private destroy$ = new Subject<void>(); 

    newNews = { title: '', content: '' };

    constructor(
      private newsService: NewsService,
      private toaster:ToastrService,
      @Inject(MAT_DIALOG_DATA) public data:any,
      private dialogRef: MatDialogRef<NewsModalComponent>
    ){}
     ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

    publishNews(): void {
        if (!this.newNews.title || !this.newNews.content) return;
    
        this.newsService.createNews(this.data.companyId, this.newNews).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.toaster.success('News published successfully!')
            this.newNews = { title: '', content: '' };
            this.dialogRef.close('submitted');
          },
          error: err =>{ 
            console.error('Error publishing news', err)
            this.toaster.error('Error publishing news')
          }
        });
      }
}
