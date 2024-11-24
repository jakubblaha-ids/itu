import { ItemManagerBase, ListManagerBase, UserManagerBase, type InListItem, type ItemAmountUnit, type List, type ListManagerBaseOptions } from "backend";
import { get, writable } from "svelte/store";
import { defaultListSortDir, defaultListSortType, type ListSortDir, type ListSortType } from "./listSort";
import { itemManager } from ".";

function cmpName(a: InListItem, b: InListItem, dir: ListSortDir) {
    if((a.customItemName || itemManager.getNameOfitemId(a.itemId!)) < (b.customItemName || itemManager.getNameOfitemId(b.itemId!))) return dir === 'asc' ? -1 : 1;
    if((a.customItemName || itemManager.getNameOfitemId(a.itemId!)) > (b.customItemName || itemManager.getNameOfitemId(b.itemId!))) return dir === 'asc' ? 1 : -1;
    return 0;
}

function cmpCategory(a: InListItem, b: InListItem, dir: ListSortDir) {
    const aCat = itemManager.getCategoryNameOfItemId(a.itemId);
    const bCat = itemManager.getCategoryNameOfItemId(b.itemId);

    if(aCat < bCat) return dir === 'asc' ? -1 : 1;
    if(aCat > bCat) return dir === 'asc' ? 1 : -1;

    return cmpName(a, b, dir);
}

export class ListManager extends ListManagerBase {
    lists = writable<List[]>([]);
    selectedList = writable<List | null>(null);
    selectedListIdStore = writable<string>("null");
    selectedListSortType = writable<ListSortType>(defaultListSortType);
    selectedListSortDir = writable<ListSortDir>(defaultListSortDir);
    
    constructor(itemManager: ItemManagerBase, userManager: UserManagerBase, options: ListManagerBaseOptions = {}
    ) {
        super(itemManager, userManager, {
            ...options,
            onAvailableListsChange: (lists) => {
                this.lists.set(lists);
            },
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
    

    sortSelectedList(type: ListSortType, dir: ListSortDir) {
        this.selectedListSortType.set(type);
        this.selectedListSortDir.set(dir);

        const list = get(this.selectedList);
        if(!list) return;

        this.options.onSelectedListDataChange?.(list);
    }

    async editItem(list: List, id: number, amount: number | string, unit: ItemAmountUnit): Promise<void> {
		let item = list.listItems.find((item) => item.id === id);
        if(!item) return;
        
		item.itemAmount = amount;
		item.itemUnit = unit;

		await this.setListData(list.id, list);
	}
}