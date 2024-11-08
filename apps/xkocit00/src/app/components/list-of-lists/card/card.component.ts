import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  output,
  Output,
} from '@angular/core';
import { List } from 'backend';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  public isSmallScreen: boolean = false;
  @Input() item: List = { id: '', listTitle: '', listItems: [], code: 0 };

  @Output() resetLsit: EventEmitter<void> = new EventEmitter<void>();
  @Output() viewList: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteList: EventEmitter<void> = new EventEmitter<void>();
  @Output() editList: EventEmitter<void> = new EventEmitter<void>();
  @Output() copyList: EventEmitter<void> = new EventEmitter<void>();
  @Output() shareList: EventEmitter<void> = new EventEmitter<void>();
  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 500;
  }
}
