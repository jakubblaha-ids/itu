import { Injectable } from '@angular/core';
import { ItemManagerBase, InListItem, Item } from 'backend'; // Ensure this path is correct
import { ListManagerService } from './list-manager.service'; // Ensure this path is correct
import { UserManagerService } from './user-manager.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemManagerService {
  private itemManager: ItemManagerBase;
  private itemsSource = new BehaviorSubject<InListItem[]>([]);
  public items$ = this.itemsSource.asObservable();
  private recentlyUsedItems: Item[] = [];

  constructor(
    private listManagerService: ListManagerService,
    private userManagerService: UserManagerService,
  ) {
    this.itemManager = new ItemManagerBase();
    this.itemManager.getRecentlyUsedItems().forEach((item: any) => {
      // TODO: fix
      // let it: Item = { id: item.itemId, categoryName: item };
      this.itemManager.getNameOfitemId(item.itemId);
      // this.recentlyUsedItems.push(item);
    });
  }

  getManager(): ItemManagerBase {
    return this.itemManager;
  }

  async fetchItems(listId: string): Promise<void> {
    const listData = await this.listManagerService
      .getManager()
      .getListData(listId);
    this.itemsSource.next(listData ? listData.listItems : []);
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
