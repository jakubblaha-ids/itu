import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  name: string;
  quantity: number;
  quantityType: string;
  existingNames: string[]; // Add this line
  isEdit: boolean;
}

@Component({
  selector: 'app-create-item-dialog',
  templateUrl: './create-item-dialog.component.html',
  styleUrls: ['./create-item-dialog.component.css'],
})
export class CreateItemDialogComponent implements OnInit {
  public quantityTypes: string[] = ['pcs', 'g', 'ml', 'custom'];
  public form: FormGroup;
  private originalName: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreateItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, this.nameValidator.bind(this)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      quantityType: ['', Validators.required],
      customQuantityType: [''],
    });
  }

  ngOnInit(): void {
    this.originalName = JSON.parse(JSON.stringify(this.data.name));
    console.log(this.data);
    this.form.patchValue({
      name: this.data.name,
      quantity: this.data.quantity,
      quantityType: this.data.quantityType,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public onCreateClick(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  private nameValidator(control: any): { [key: string]: boolean } | null {
    if (this.data.existingNames.includes(control.value) && !this.data.isEdit) {
      return { unique: true };
    } else if (
      this.data.existingNames.includes(control.value) &&
      control.value != this.originalName
    ) {
      return { unique: true };
    }
    return null;
  }
}
