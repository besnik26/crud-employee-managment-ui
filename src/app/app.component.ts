import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crud-employee-managment-ui';


  showHeader = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        let route = this.activatedRoute.firstChild;

        while (route?.firstChild) {
          route = route.firstChild;
        }

        const hideHeader = route?.snapshot.data?.['hideHeader'];
        this.showHeader = !hideHeader;
      });
  }
}
