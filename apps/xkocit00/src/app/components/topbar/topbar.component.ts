import { Component, Input } from '@angular/core';
import { UserManagerService } from '../../services/user-manager.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  @Input() isLoggedIn: boolean = false;
  @Input() canGoBack: boolean = false;

  constructor(private userManager: UserManagerService) {}

  public navigateBack(): void {
    window.history.back();
  }

  public navigateToSettings(): void {
    console.log('Navigate to settings');
    this.userManager.openSettings();
    // Navigate to the settings page
  }
}
