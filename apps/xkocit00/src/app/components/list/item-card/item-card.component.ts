import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InListItem } from 'backend'; // Ensure this path is correct

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css'],
})
export class ItemCardComponent {
  @Input() item: InListItem = {
    id: 0,
    itemId: null,
    customItemName: null,
    itemAmount: 1,
    itemUnit: 'pcs',
    itemChecked: false,
    itemCheckedByUsername: '',
  };

  @Output() editItem = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<void>();
  @Output() checkItem = new EventEmitter<void>();

  onEditItem(): void {
    this.editItem.emit();
  }

  onDeleteItem(): void {
    this.deleteItem.emit();
  }

  onCheckItem(): void {
    this.checkItem.emit();
  }
}
