import { ItemManagerBase, ListManagerBase, UserManagerBase, type List, type ListManagerBaseOptions } from "backend";
import { writable } from "svelte/store";

export class ListManager extends ListManagerBase {
    lists = writable<List[]>([]);
    constructor(itemManager: ItemManagerBase, userManager: UserManagerBase, options: ListManagerBaseOptions = {}) {
        super(itemManager, userManager, options);
    }
}