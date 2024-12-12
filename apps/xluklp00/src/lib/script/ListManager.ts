// author: Pavel Lukl, xluklp00
// defines the ListManager class

import { ItemManagerBase, ListManagerBase, UserManagerBase, type InListItem, type ItemAmountUnit, type List, type ListManagerBaseOptions } from "backend";
import { get, writable } from "svelte/store";
import { defaultListSortDir, defaultListSortType, type ListSortDir, type ListSortType } from "./listSort";
import { itemManager } from ".";

// compare function for sorting
function cmpName(a: InListItem, b: InListItem, dir: ListSortDir) {
    if((a.customItemName || itemManager.getNameOfitemId(a.itemId!)) < (b.customItemName || itemManager.getNameOfitemId(b.itemId!))) return dir === 'asc' ? -1 : 1;
    if((a.customItemName || itemManager.getNameOfitemId(a.itemId!)) > (b.customItemName || itemManager.getNameOfitemId(b.itemId!))) return dir === 'asc' ? 1 : -1;
    return 0;
}

// compare function for sorting
function cmpCategory(a: InListItem, b: InListItem, dir: ListSortDir) {
    const aCat = itemManager.getCategoryNameOfItemId(a.itemId);
    const bCat = itemManager.getCategoryNameOfItemId(b.itemId);

    if(aCat < bCat) return dir === 'asc' ? -1 : 1;
    if(aCat > bCat) return dir === 'asc' ? 1 : -1;

    return cmpName(a, b, dir);
}

export class ListManager extends ListManagerBase {
    // svelte store for lists
    lists = writable<List[]>([]);
    // svelte store for selected list
    selectedList = writable<List | null>(null);
    // svelte store for selected list id
    selectedListIdStore = writable<string>("null");
    // svelte store for selected list sort type
    selectedListSortType = writable<ListSortType>(defaultListSortType);
    // svelte store for selected list
    selectedListSortDir = writable<ListSortDir>(defaultListSortDir);
    
    constructor(itemManager: ItemManagerBase, userManager: UserManagerBase, options: ListManagerBaseOptions = {}
    ) {
        super(itemManager, userManager, {
            ...options,
            onAvailableListsChange: (lists) => {
                this.lists.set(lists);
            },
            // automatically sort selected list when it changes
            onSelectedListDataChange: (list) => {
                if(!list) {
                    this.selectedList.set(null);
                    return;
                }

                const items = list.listItems;
                let checkedItems = items.filter(item => item.itemChecked);
                let uncheckedItems = items.filter(item => !item.itemChecked);

                const sortType = get(this.selectedListSortType);
                const sortDir = get(this.selectedListSortDir);

                if(sortType === 'alpha') {
                    checkedItems.sort((a, b) => cmpName(a, b, sortDir));
                    uncheckedItems.sort((a, b) => cmpName(a, b, sortDir));
                } else if(sortType === 'category') {
                    checkedItems.sort((a, b) => cmpCategory(a, b, sortDir));
                    uncheckedItems.sort((a, b) => cmpCategory(a, b, sortDir));
                }

                list.listItems = [...checkedItems, ...uncheckedItems];

                this.selectedList.set(list);
            }, 
            onSelectedListChange: (listId) => {
                this.selectedListIdStore.set(listId);
            }
        });
    }
    
    // sorts the selected list
    sortSelectedList(type: ListSortType, dir: ListSortDir) {
        this.selectedListSortType.set(type);
        this.selectedListSortDir.set(dir);

        const list = get(this.selectedList);
        if(!list) return;

        this.options.onSelectedListDataChange?.(list);
    }

    // edit item in list
    async editItem(list: List, id: number, amount: number | string, unit: ItemAmountUnit): Promise<void> {
		let item = list.listItems.find((item) => item.id === id);
        if(!item) return;
        
		item.itemAmount = amount;
		item.itemUnit = unit;

		await this.setListData(list.id, list);
	}
}