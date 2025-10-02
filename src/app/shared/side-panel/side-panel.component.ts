import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/services/panel.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent {
  sidePanelOpen?:boolean;

  constructor(
    private panelService:PanelService,
    private router:Router,
    public authService:AuthService,
    private toaster:ToastrService,
    private elementRef:ElementRef

  ){ 
    this.panelService.sidePanelState$.subscribe(state => {
        this.sidePanelOpen = state;
    });

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toaster.info('Logged out successfully!')
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
