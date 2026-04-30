import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showHeader = true;
  title = 'task-management-system';
  @Input() status: string = '';
  constructor(private router: Router) {
    // Listen to routing changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide header if the URL is '/login'
      this.showHeader = !event.urlAfterRedirects.includes('/login');
    });
  }
}
