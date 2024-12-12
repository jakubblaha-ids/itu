import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface ListDialogData {
  listTitle: string;
  listId?: string;
  isEdit: boolean;
  isCopy: boolean;
  existingTitles: string[];
}

/**
 * Dialog for creating a new list
 *
 * @author Tomáš Kocí
 */
@Component({
  selector: 'app-create-list-dialog',
  templateUrl: './create-list-dialog.component.html',
  styleUrls: ['./create-list-dialog.component.css'],
})
export class CreateListDialogComponent {
  form: FormGroup;
  private originalTitle: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreateListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListDialogData,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      listTitle: [
        'New List',
        [
          Validators.required,
          Validators.minLength(3),
          // this.titleValidator.bind(this),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.originalTitle = JSON.parse(JSON.stringify(this.data.listTitle));
    this.form.patchValue({
      listTitle: this.data.listTitle,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateClick(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  private titleValidator(control: any): { [key: string]: boolean } | null {
    if (this.data.existingTitles.includes(control.value) && !this.data.isEdit) {
      return { unique: true };
    } else if (
      this.data.existingTitles.includes(control.value) &&
      control.value != this.originalTitle
    ) {
      return { unique: true };
    }
    return null;
  }
}
