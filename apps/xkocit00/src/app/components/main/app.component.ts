import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { ResourceManagerService } from '../../services/resource-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Shopli';
  public canGoBack: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private resourceManager: ResourceManagerService,
  ) {
    this.authService.loggedInStatus.subscribe((value: boolean) => {
      this.router.navigate(['/main-list']);
    });
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
