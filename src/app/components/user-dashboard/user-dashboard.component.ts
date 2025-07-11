import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {
  user: any;
  companyUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserDashboard().subscribe((data) => {
      this.user = data;
    });

    this.userService.getCompanyUsers().subscribe((users) => {
      this.companyUsers = users;
    });
  }
}
