import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  header: string;
  warning: string;
}

/**
 * Generic component for confirmation dialog
 *
 * @author Tomáš Kocí
 */
@Component({
  selector: 'app-confiramtion-dialog',
  templateUrl: './confiramtion-dialog.component.html',
  styleUrls: ['./confiramtion-dialog.component.css'],
})
export class ConfiramtionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfiramtionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
