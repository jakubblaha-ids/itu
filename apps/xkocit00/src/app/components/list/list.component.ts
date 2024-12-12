import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { InListItem, List } from 'backend'; // Ensure this path is correct
import {
  ItemInList,
  ItemManagerService,
} from '../../services/item-manager.service';
import {
  CreateItemDialogComponent,
  DialogData,
} from './create-item-dialog/create-item-dialog.component';
import { ConfiramtionDialogComponent } from '../confiramtion-dialog/confiramtion-dialog.component';

/**
 * Shopping list component
 *
 * @author Tomáš Kocí
 */
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  listId!: string;
  items: ItemInList[] = [];
  public sorting: string = 'alphabetically';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private itemManagerService: ItemManagerService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('listID');
    if (!id) {
      this.snackBar.open('Cannot find given list', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/main-list']); // Navigate back to the list of lists
      return;
    }
    this.listId = id;
    this.itemManagerService.items$.subscribe((items) => {
      this.items = items;
      this.sortBy({ value: this.sorting });
    });
    this.loadItems();
  }

  private async loadItems(): Promise<void> {
    this.itemManagerService.fetchItems(this.listId);
  }

  async addItem(): Promise<void> {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '350px',
      data: {
        name: '',
        quantity: 1,
        quantityType: 'pcs',
        existingNames: this.items.map(
          (item) => item.customItemName || item.itemId,
        ),
        isEdit: false,
      } as DialogData,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        console.log(result);
        const newItem: InListItem = {
          id: new Date().getTime(),
          itemId: null,
          customItemName: result.name,
          itemAmount: result.quantity,
          itemUnit: result.quantityType,
          itemChecked: false,
          itemCheckedByUsername: '',
        };
        await this.itemManagerService.addItemToList(this.listId, newItem);
        this.loadItems();
      }
    });
  }

  async editItem(item: InListItem): Promise<void> {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '350px',
      data: {
        name: item.customItemName,
        quantity: item.itemAmount,
        quantityType: item.itemUnit,
        existingNames: this.items.map(
          (item) => item.customItemName || item.itemId,
        ),
        isEdit: true,
      } as DialogData,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const newItem: InListItem = {
          id: item.id,
          itemId: null,
          customItemName: result.name,
          itemAmount: result.quantity,
          itemUnit: result.quantityType,
          itemChecked: item.itemChecked,
          itemCheckedByUsername: item.itemCheckedByUsername,
        };
        await this.itemManagerService.editItemInList(this.listId, newItem);
        this.loadItems();
      }
    });
    this.loadItems();
  }

  async deleteItem(itemId: number): Promise<void> {
    await this.itemManagerService.removeItemFromList(this.listId, itemId);
    this.loadItems();
  }

  async checkItem(item: InListItem): Promise<void> {
    item.itemChecked = !item.itemChecked;
    await this.itemManagerService.editItemInList(this.listId, item);
    this.loadItems();
  }

  get checkedItems(): ItemInList[] {
    return this.items.filter((item) => item.itemChecked);
  }

  get uncheckedItems(): ItemInList[] {
    return this.items.filter((item) => !item.itemChecked);
  }

  public sortBy(event: any): void {
    const value = event.value;
    if (value === 'alphabetically') {
      this.items.sort((a, b) =>
        (a.customItemName ?? a.itemId ?? '').localeCompare(
          b.customItemName ?? b.itemId ?? '',
        ),
      );
    } else if (value === 'byCategory') {
      this.items.sort((a, b) => {
        if (a.cathegory < b.cathegory) {
          return -1;
        } else if (a.cathegory > b.cathegory) {
          return 1;
        } else {
          // Categories are the same, sort by name
          return (a.customItemName ?? a.itemId ?? '').localeCompare(
            b.customItemName ?? b.itemId ?? '',
          );
        }
      });
    }
  }

  public deleteSelected(): void {
    this.dialog
      .open(ConfiramtionDialogComponent, {
        width: '350px',
        data: {
          header: 'Delete all checked items',
          warning: 'Are you sure you want to delete all checked items?',
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.itemManagerService
            .deleteAllCheckedItems(this.listId)
            .then(() => {
              this.loadItems();
            });
        }
      });
  }

  public viewList(list: List): void {
    this.router.navigate(['/list', list.id]);
  }
}
