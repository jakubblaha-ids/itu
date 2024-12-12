import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface SettingsDialogData {
  name: string;
}

/**
 * Dialog for settings allows user to change his name
 *
 * @author Tomáš Kocí
 */
@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css'],
})
export class SettingsDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsDialogData,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: [data.name || '', [Validators.required, Validators.minLength(1)]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
