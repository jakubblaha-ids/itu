import { Injectable } from '@angular/core';
import { ItemManagerBase, List, ListManagerBase } from 'backend';
import { ItemManagerService } from './item-manager.service';
import { UserManagerService } from './user-manager.service';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for managing lists wraps the ListManagerBase
 *
 * @author Tomáš Kocí
 */
@Injectable({
  providedIn: 'root',
})
export class ListManagerService {
  private listManager: ListManagerBase;
  private availableLists: List[] = [];
  private avaliableListsSource = new BehaviorSubject<List[]>(
    this.availableLists,
  );
  public availableLists$ = this.avaliableListsSource.asObservable();

  constructor(private userManagerService: UserManagerService) {
    const itemManager = new ItemManagerBase();
    this.listManager = new ListManagerBase(
      itemManager,
      this.userManagerService.getManager(),
      {
        onSelectedListChange: (listId: string) =>
          this.onSelectedListChange(listId),
        onSelectedListDataChange: (listData: List) =>
          this.onSelectedListDataChange(listData),
        onAvailableListsChange: (lists: List[]) =>
          this.onAvailableListsChange(lists),
      },
    );
  }

  getManager(): ListManagerBase {
    return this.listManager;
  }

  private onSelectedListChange(listId: string): void {
    // Update state or perform other actions
  }

  private onSelectedListDataChange(listData: List): void {
    // Update state or perform other actions
  }

  private onAvailableListsChange(lists: List[]): void {
    this.availableLists = lists;
    this.avaliableListsSource.next(this.availableLists);
    // Update state or perform other actions
  }

  public async createList(name: string): Promise<void> {
    await this.listManager.createList();

    const newListId = localStorage.getItem('lastSelectedList');
    if (newListId != null) {
      await this.listManager.setListTitle(newListId, name);
    }

    this.listManager.refreshAvailableLists();
  }

  public async copyList(list: List, listNewName: string): Promise<void> {
    await this.listManager.createList();

    const newListId = localStorage.getItem('lastSelectedList');
    if (newListId != null) {
      await this.listManager.setListTitle(newListId, listNewName);
      let listData = await this.listManager.getListData(newListId);
      if (listData != null) {
        listData.listItems = list.listItems;
        await this.listManager.setListData(newListId, listData);
      }
    }
    this.listManager.refreshAvailableLists();
  }

  public async deleteList(listId: string): Promise<void> {
    await this.listManager.removeListLocally(listId);
    await this.listManager.refreshAvailableLists();
  }

  public async getAllLists(): Promise<List[]> {
    await this.listManager.refreshAvailableLists();
    return this.availableLists;
  }

  public async importList(code: number): Promise<void> {
    await this.listManager.importList(code);
    this.listManager.refreshAvailableLists();
  }

  public async setListTitle(listId: string, title: string): Promise<void> {
    await this.listManager.setListTitle(listId, title);
    this.listManager.refreshAvailableLists();
  }

  public async resetList(listId: string): Promise<void> {
    // get list items
    const listItems = await this.listManager.getListData(listId);
    if (listItems == null) {
      return;
    }

    // reset list items
    listItems?.listItems.forEach((item) => {
      if (item.itemChecked) {
        item.itemChecked = false;
        item.itemCheckedByUsername = '';
      }
    });
    this.getManager().setListData(listId, listItems);
  }
}
