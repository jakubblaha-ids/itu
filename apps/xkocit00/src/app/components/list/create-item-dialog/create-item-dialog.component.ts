import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'backend';
import { map, Observable, startWith } from 'rxjs';
import { ItemManagerService } from '../../../services/item-manager.service';

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
  public quantityTypes: string[] = ['pcs', 'g', 'kg', 'ml', 'l', 'custom'];
  public form: FormGroup;
  private originalName: string = '';
  public filteredItems: Observable<Item[]> | undefined;

  constructor(
    public dialogRef: MatDialogRef<CreateItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private itemManager: ItemManagerService,
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
    if (this.data.isEdit) {
      let type: string = '';
      let customQuantity: string = '';
      if (!this.quantityTypes.includes(this.data.quantityType)) {
        type = 'custom';
        customQuantity = this.data.quantityType;
      }
      this.form.patchValue({
        name: this.data.name,
        quantity: this.data.quantity,
        quantityType: type,
        customQuantityType: customQuantity,
      });
    }

    this.filteredItems = this.form.get('name')?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value)),
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public onCreateClick(): void {
    if (this.form.valid) {
      if (this.form.value.quantityType === 'custom') {
        this.form.value.quantityType = this.form.value.customQuantityType;
      }
      console.log(this.form.value);
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

  private _filter(value: string): Item[] {
    const filterValue = value.toLowerCase();
    return this.itemManager.getAvailableItems(filterValue);
  }
}
