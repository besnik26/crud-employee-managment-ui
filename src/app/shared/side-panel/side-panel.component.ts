import { DashboardService } from 'src/app/services/dashboard.service';
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyWithUsersDto } from 'src/app/models/CompanyWithUsersDto';
import { AdminService } from 'src/app/services/admin.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { Subject, take, takeUntil } from 'rxjs';
@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>(); 
  sidePanelOpen?:boolean;
  companies: CompanyWithUsersDto[] = [];
  memberDropdownOpen: boolean = false;
  newsDropdownOpen: boolean = false;
  role = '';
  user:any;

  constructor(
    private panelService:PanelService,
    private router:Router,
    public authService:AuthService,
    private toaster:ToastrService,
    private elementRef:ElementRef,
    private adminService:AdminService,
    private userContext:UserContextService,
    private dashboardService: DashboardService
  ){ 
    this.panelService.sidePanelState$.subscribe(state => {
        this.sidePanelOpen = state;
    });

  }

  ngOnInit(): void {
    this.userContext.role$.subscribe(role => {
      this.role = role || '';
    })
    if(this.role ==='admin'){
      this.adminService.getMyCompanies().pipe(takeUntil(this.destroy$)).subscribe(data => this.companies = data);
    } else if(this.role === 'user'){
      this.dashboardService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
        this.user = user;
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toaster.info('Logged out successfully!')
  }

  toggleMemberDropdown(): void {
    this.newsDropdownOpen = false;
      this.memberDropdownOpen = !this.memberDropdownOpen;
  }

  toggleNewsDropdown(): void {
    this.memberDropdownOpen = false;
    this.newsDropdownOpen = !this.newsDropdownOpen;
  }

  navigateTo(link:string, id:number){
    this.router.navigate([link + id])
  }

  // @HostListener('document:click', ['$event'])
  //   ClickOut(event: MouseEvent) {
  //     const isClickedOutside = !this.elementRef.nativeElement.contains(
  //       event.target as Node
  //     );
  //     if (isClickedOutside) {
  //       this.sidePanelOpen = false;
  //     }
  //   }
    
 


}
