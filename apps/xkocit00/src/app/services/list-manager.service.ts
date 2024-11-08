import { Injectable } from '@angular/core';
import { ItemManagerBase, List, ListManagerBase } from 'backend';
import { ItemManagerService } from './item-manager.service';
import { UserManagerService } from './user-manager.service';
import { BehaviorSubject } from 'rxjs';

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
        onSelectedListChange: (listId) => this.onSelectedListChange(listId),
        onSelectedListDataChange: (listData) =>
          this.onSelectedListDataChange(listData),
        onAvailableListsChange: (lists) => this.onAvailableListsChange(lists),
      },
    );
  }

  getManager(): ListManagerBase {
    return this.listManager;
  }

  private onSelectedListChange(listId: string): void {
    console.log('Selected list ID changed to:', listId);
    // Update state or perform other actions
  }

  private onSelectedListDataChange(listData: List): void {
    console.log('Selected list data:', listData);
    // Update state or perform other actions
  }

  private onAvailableListsChange(lists: List[]): void {
    this.availableLists = lists;
    this.avaliableListsSource.next(this.availableLists);
    console.log('Available lists:', lists);
    // Update state or perform other actions
  }

  public async createList(name: string): Promise<void> {
    await this.listManager.createList();
    const newListId = localStorage.getItem('lastSelectedList');
    console.log('New list ID from create:', newListId);
    if (newListId != null) {
      await this.listManager.setListTitle(newListId, name);
    }
    this.listManager.refreshAvailableLists();
  }

  public async deleteList(listId: string): Promise<void> {
    const records = JSON.parse(localStorage.getItem('addedLists') || '[]');
    const index = records.indexOf(listId);
    if (index > -1) {
      records.splice(index, 1);
    }
    localStorage.setItem('addedLists', JSON.stringify(records));
    this.availableLists = this.availableLists.filter(
      (list) => list.id !== listId,
    );
    await this.listManager.refreshAvailableLists();
    this.listManager.deleteList(listId);
  }

  public async getAllLists(): Promise<List[]> {
    await this.listManager.refreshAvailableLists();
    return this.availableLists;
  }

  public async importList(code: number): Promise<void> {
    console.log('Importing list with code:', code);
    console.log(typeof code);
    await this.listManager.importList(code);
    this.listManager.refreshAvailableLists();
  }

  public async setListTitle(listId: string, title: string): Promise<void> {
    await this.listManager.setListTitle(listId, title);
    this.listManager.refreshAvailableLists();
  }
}
