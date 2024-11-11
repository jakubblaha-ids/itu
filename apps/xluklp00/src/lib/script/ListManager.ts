import { ItemManagerBase, ListManagerBase, UserManagerBase, type InListItem, type List, type ListManagerBaseOptions } from "backend";
import { writable } from "svelte/store";

function cmpCheckedItems(a: InListItem, b: InListItem) {
    if (a.itemChecked && !b.itemChecked) return -1;
    if (!a.itemChecked && b.itemChecked) return 1;
    return 0;
}

export class ListManager extends ListManagerBase {
    lists = writable<List[]>([]);
    selectedList = writable<List | null>(null);
    selectedListIdStore = writable<string>("null");
    
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

                list.listItems.sort(cmpCheckedItems);
                this.selectedList.set(list);
            }, 
            onSelectedListChange: (listId) => {
                this.selectedListIdStore.set(listId);
            }
        });
    }
}