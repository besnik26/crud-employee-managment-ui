import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  companyId!: number;

  constructor(
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
     this.companyId = +this.route.snapshot.paramMap.get('companyId')!;
  }
}
