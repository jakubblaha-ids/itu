import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManagerBase } from 'backend'; // Ensure this path is correct
import { SettingsDialogComponent } from '../components/topbar/settings-dialog/settings-dialog.component';

/**
 * Service for managing user wraps the UserManagerBase
 *
 * @author Tomáš Kocí
 */

@Injectable({
  providedIn: 'root',
})
export class UserManagerService {
  private userManager: UserManagerBase;
  public username: string = 'Tomas';

  constructor(private dialog: MatDialog) {
    const name = localStorage.getItem('username');
    if (name) {
      this.username = name;
    } else {
      localStorage.setItem('username', this.username);
    }

    this.userManager = new UserManagerBase({
      onUsernameChange: (username: string) => this.onUsernameChange(username),
    });
  }

  getManager(): UserManagerBase {
    return this.userManager;
  }

  public openSettings(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      data: { name: this.username },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userManager.setUsername(result.name);
      }
    });
  }

  private onUsernameChange(username: string): void {
    this.username = username;
  }
}
