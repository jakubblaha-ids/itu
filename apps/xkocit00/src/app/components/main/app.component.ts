import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ResourceManagerService } from '../../services/resource-manager.service';

/**
 * Main component of the application wrapping the whole application
 *
 * @author Tomáš Kocí
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Shopli';
  public canGoBack: boolean = false;

  constructor(
    private router: Router,
    private resourceManager: ResourceManagerService,
  ) {
    this.router.navigate(['/main-list']);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.canGoBack = !['/login', '/main-list'].includes(
          event.urlAfterRedirects,
        );
      }
    });
  }

  ngOnInit() {
    const currentUrl = this.router.url;
    this.canGoBack = !['/login', '/main-list'].includes(currentUrl);
  }
}
