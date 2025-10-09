import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyWithUsersDto } from 'src/app/models/CompanyWithUsersDto';
import { AdminService } from 'src/app/services/admin.service';

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

  constructor(
    private panelService:PanelService,
    private router:Router,
    public authService:AuthService,
    private toaster:ToastrService,
    private elementRef:ElementRef,
    private adminService:AdminService
  ){ 
    this.panelService.sidePanelState$.subscribe(state => {
        this.sidePanelOpen = state;
    });

  }

  ngOnInit(): void {
    this.adminService.getMyCompanies().subscribe(data => this.companies = data);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toaster.info('Logged out successfully!')
  }

  toggleMemberDropdown(): void {
    this.memberDropdownOpen = !this.memberDropdownOpen;
    this.newsDropdownOpen = false;
  }

  toggleNewsDropdown(): void {
    this.newsDropdownOpen = !this.newsDropdownOpen;
    this.memberDropdownOpen = false;
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
