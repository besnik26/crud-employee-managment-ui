import { Component } from '@angular/core';
import { PanelService } from 'src/app/services/panel.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent {
  sidePanelOpen?:boolean;

  constructor(private panelService:PanelService){ 
    this.panelService.sidePanelState$.subscribe(state => {
        this.sidePanelOpen = state;
    });

  }
  
 


}
