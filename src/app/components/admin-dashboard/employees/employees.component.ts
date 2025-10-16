import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { JoinRequestService } from 'src/app/services/join-request.service';
import { takeUntil, Subject } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>(); 
  companyId!: number;
  userIdToInvite: number = 0;
  company: any;
  users: any[] = [];
  userIdToAssign!: number;
  displayedColumns: string[] = ['id', 'username','email', 'phoneNumber', 'actions'];
  dataSource:any;
  @ViewChild(MatPaginator) paginator! : MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private adminService:AdminService,
    private joinRequestService:JoinRequestService,
    private toaster:ToastrService
  ){}

  ngOnInit():void{
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.companyId = +params.get('companyId')!;
      this.getCompanyInfo();
      this.getCompanyUsers();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCompanyInfo(): void {
    this.adminService.getCompanyById(this.companyId).subscribe(
      data => this.company = data,
      err => {
        console.error('Error fetching company', err)
        this.toaster.error('Error fetching company')
      }
    );
  }

  getCompanyUsers(): void {
      this.adminService.getCompanyUsers(this.companyId).pipe(takeUntil(this.destroy$)).subscribe({
        next:(data) =>{
          this.users = data;
          this.dataSource =  new MatTableDataSource<any>(this.users)
        },
        error:(err)=>{
          console.error('Error fetching users', err);
          this.toaster.error('Error fetching users');
        },
        complete:() =>{
          console.log('Users fetched successfully');
          this.dataSource.paginator = this.paginator;
          console.log('Complete:' + this.dataSource.paginator);
        }
      });
  }

  removeUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.removeUserFromCompany(this.companyId, userId).subscribe({
        next: () => {
          this.getCompanyUsers()
          this.toaster.success('User removed successfully!');
        },
        error: err => console.error('Error removing user', err)
      });
    }
  }

  sendRequest() {
    this.joinRequestService.sendJoinRequest(this.userIdToInvite, this.companyId).subscribe({
      next: () => {
        this.toaster.info('Join request sent successfully.')
      },
      error: (err) => {
        if (err.status === 400 && err.error?.message?.includes("24 hours")) {
          this.toaster.error('You can only send a new invite every 24 hours.";')
        } else {
          this.toaster.error('Error sending request.')
        }
        console.error(err);
      }
    });
  }
}
