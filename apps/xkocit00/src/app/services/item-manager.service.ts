import { Injectable } from '@angular/core';
import { ItemManagerBase, InListItem, Item } from 'backend'; // Ensure this path is correct
import { ListManagerService } from './list-manager.service'; // Ensure this path is correct
import { UserManagerService } from './user-manager.service';
import { BehaviorSubject } from 'rxjs';

export interface ItemInList extends InListItem {
  cathegory: string;
}

/**
 * Service for managing items wraps the ItemManagerBase
 *
 * @author Tomáš Kocí
 */
@Injectable({
  providedIn: 'root',
})
export class ItemManagerService {
  private itemManager: ItemManagerBase;
  private itemsSource = new BehaviorSubject<ItemInList[]>([]);
  public items$ = this.itemsSource.asObservable();

  constructor(
    private listManagerService: ListManagerService,
    private userManagerService: UserManagerService,
  ) {
    this.itemManager = new ItemManagerBase();
  }

  getManager(): ItemManagerBase {
    return this.itemManager;
  }

  async fetchItems(listId: string): Promise<void> {
    const listData = await this.listManagerService
      .getManager()
      .getListData(listId);
    await this.itemManager.refreshAvailableItems();

    let listItems = listData?.listItems as ItemInList[];

    listItems.forEach((element) => {
      if (!element.customItemName) {
        console.log(element);
        element.customItemName = this.itemManager.getNameOfitemId(
          element.itemId ?? '',
        );
      }
    });

    listItems.forEach((element) => {
      if (!element.cathegory) {
        element.cathegory = this.itemManager.getCategoryNameOfItemId(
          element.itemId ?? '',
        );
      }
    });
    this.itemsSource.next(listItems ? listItems : []);
  }

  async addItemToList(listId: string, item: InListItem): Promise<void> {
    const listData = await this.listManagerService
      .getManager()
      .getListData(listId);
    if (listData) {
      console.log(listData);
      console.log('Adding item to list:', item);
      listData.listItems.push(item);
      await this.listManagerService.getManager().setListData(listId, listData);
    }
  }

  async editItemInList(listId: string, item: InListItem): Promise<void> {
    const listData = await this.listManagerService
      .getManager()
      .getListData(listId);
    if (item.itemChecked) {
      item.itemCheckedByUsername = this.userManagerService.username;
    } else {
      item.itemCheckedByUsername = '';
    }
    if (listData) {
      const index = listData.listItems.findIndex((i: any) => i.id === item.id);
      if (index !== -1) {
        listData.listItems[index] = item;
        await this.listManagerService
          .getManager()
          .setListData(listId, listData);
      }
    }
  }

  async removeItemFromList(listId: string, itemId: number): Promise<void> {
    await this.listManagerService
      .getManager()
      .deleteItemFromList(listId, itemId);
  }

  async deleteAllCheckedItems(listId: string): Promise<void> {
    return this.listManagerService.getManager().deleteAllCheckedItems(listId);
  }

  public getAvailableItems(filter: string): Item[] {
    if (filter.length === 0) {
      // return this.itemManager.getRecentlyUsedItems();
    }
    this.itemManager.refreshAvailableItems();
    return this.itemManager.getAvailableItems(filter);
  }
}
