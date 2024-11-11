import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-import-list',
  templateUrl: './import-list.component.html',
  styleUrls: ['./import-list.component.css'],
})
export class ImportListComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ImportListComponent>,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      uid: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onImportClick(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
