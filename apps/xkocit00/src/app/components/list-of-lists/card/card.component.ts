import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { List } from 'backend';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() item: List = { id: '', listTitle: '', listItems: [], code: 0 };

  @Output() resetLsit: EventEmitter<void> = new EventEmitter<void>();
  @Output() viewList: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteList: EventEmitter<void> = new EventEmitter<void>();
  @Output() editList: EventEmitter<void> = new EventEmitter<void>();
  @Output() copyList: EventEmitter<void> = new EventEmitter<void>();
  @Output() shareList: EventEmitter<void> = new EventEmitter<void>();
}
