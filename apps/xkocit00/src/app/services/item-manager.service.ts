import { Injectable } from '@angular/core';
import { ItemManagerBase, InListItem } from 'backend'; // Ensure this path is correct
import { ListManagerService } from './list-manager.service'; // Ensure this path is correct
import { UserManagerService } from './user-manager.service';

@Injectable({
  providedIn: 'root',
})
export class ItemManagerService {
  private itemManager: ItemManagerBase;

  constructor(
    private listManagerService: ListManagerService,
    private userManagerService: UserManagerService,
  ) {
    this.itemManager = new ItemManagerBase();
  }

  getManager(): ItemManagerBase {
    return this.itemManager;
  }

  async fetchItems(listId: string): Promise<InListItem[]> {
    const listData = await this.listManagerService
      .getManager()
      .getListData(listId);
    return listData ? listData.listItems : [];
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
      const index = listData.listItems.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        console.log(listData);
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
}
