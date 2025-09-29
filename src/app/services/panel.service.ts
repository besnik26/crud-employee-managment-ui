import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
    private sidePanelState = new BehaviorSubject<boolean>(false);
    sidePanelState$ = this.sidePanelState.asObservable();

    toggleSidePanel() {
        this.sidePanelState.next(!this.sidePanelState.value);
    }
}
