import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyWithUsersDto } from 'src/app/models/CompanyWithUsersDto';
import { AdminService } from 'src/app/services/admin.service';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit{
  sidePanelOpen?:boolean;
  companies: CompanyWithUsersDto[] = [];
  memberDropdownOpen: boolean = false;
  newsDropdownOpen: boolean = false;
  role = '';

  constructor(
    private panelService:PanelService,
    private router:Router,
    public authService:AuthService,
    private toaster:ToastrService,
    private elementRef:ElementRef,
    private adminService:AdminService,
    private userContext:UserContextService
  ){ 
    this.panelService.sidePanelState$.subscribe(state => {
        this.sidePanelOpen = state;
    });

  }

  ngOnInit(): void {
    
    this.adminService.getMyCompanies().subscribe(data => this.companies = data);
    this.userContext.role$.subscribe(role => {
      this.role = role || '';
    })
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
