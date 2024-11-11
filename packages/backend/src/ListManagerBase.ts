import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    updateDoc,
    where,
    type Unsubscribe,
} from "firebase/firestore";
import type { InListItem, ItemAmountUnit, List, RecentlyUsedItem } from "./types";
import { ResourceManagerBase } from "./ResourceManagerBase";
import { ItemManagerBase } from "./ItemManagerBase";
import { UserManagerBase } from "./UserManagerBase";

export interface ListManagerBaseOptions {
    onSelectedListChange?: (listId: string) => void;
    onSelectedListDataChange?: (listData: List) => void;
    onItemsToAddChange?: (items: InListItem[]) => void;
    onAvailableListsChange?: (lists: List[]) => void;
}

export class ListManagerBase extends ResourceManagerBase {
    options: ListManagerBaseOptions;

    selectedListId: string | null = null;
    selectedListData: List | null = null;
    availableLists: List[] = [];

    #selectedListUnsub: Unsubscribe | null = null;
    #itemManager: ItemManagerBase;
    #userManager: UserManagerBase;

    constructor(itemManager: ItemManagerBase, userManager: UserManagerBase, options: ListManagerBaseOptions = {}) {
        super();

        this.#itemManager = itemManager;
        this.#userManager = userManager;
        this.options = options;
    }

    async addListLocally(listId: string): Promise<void> {
        const lists = JSON.parse(localStorage.getItem("addedLists") || "[]");

        if (lists.includes(listId)) {
            console.warn("List is already added: " + listId);
            return;
        }

        lists.push(listId);

        localStorage.setItem("addedLists", JSON.stringify(lists));

        await this.refreshAvailableLists();
    }

    removeListLocally(listId: string): void {
        const lists = JSON.parse(localStorage.getItem("addedLists") || "[]");

        const newList = lists.filter((id: string) => id !== listId);

        localStorage.setItem("addedLists", JSON.stringify(newList));

        this.refreshAvailableLists();

        const localListIds = this.getLocallyAddedListIds();

        if (localListIds.length === 0) {
            this.setSelectedListId(null);
        } else {
            this.setSelectedListId(localListIds[0]);
        }

        this.refreshSelectedListData();
    }

    getLocallyAddedListIds() {
        const val = localStorage.getItem("addedLists");
        const parsed = JSON.parse(val || "[]");

        return parsed;
    }

    async refreshAvailableLists() {
        const addedLists = this.getLocallyAddedListIds();

        if (addedLists.length === 0) {
            this.availableLists = [];
            this.options.onAvailableListsChange?.(this.availableLists);
            return;
        }

        const q = query(collection(this.firestore, "lists"), where("__name__", "in", addedLists));
        const querySnapshot = await getDocs(q);

        this.availableLists = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as List);

        this.options.onAvailableListsChange?.(this.availableLists);
    }

    async setSelectedListId(listId: string) {
        this.selectedListId = listId;
        console.log("Selected list ID changed to: " + listId);

        localStorage.setItem("lastSelectedList", listId);

        if (this.#selectedListUnsub) {
            this.#selectedListUnsub();
        }

        if (!listId) {
            this.selectedListData = null;
            this.options.onSelectedListDataChange?.(null);
            this.options.onSelectedListChange?.(null);
            return;
        }

        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        this.#selectedListUnsub = onSnapshot(listRef, (snap) => {
            if (!snap.exists()) {
                console.error("List not found: " + listId);
                return;
            }

            this.selectedListData = { ...snap.data(), id: snap.id } as List;

            this.options.onSelectedListDataChange?.(this.selectedListData);
        });

        this.options.onSelectedListChange?.(listId);
    }

    async refreshSelectedListData() {
        if (!this.selectedListId) {
            this.selectedListData = null;
            this.options.onSelectedListDataChange?.(null);

            console.warn("No list selected and refreshSelectedListData called");
            return;
        }

        this.selectedListData = await this.getListData(this.selectedListId);

        this.options.onSelectedListDataChange?.(this.selectedListData);

        console.log("Selected list data: ", this.selectedListData);
    }

    async selectLastSelectedList() {
        const lastSelected = localStorage.getItem("lastSelectedList");

        if (lastSelected) {
            await this.setSelectedListId(lastSelected);
        }
    }

    async createList() {
        const coll = collection(this.firestore, "lists");

        const newList = {
            listTitle: "New list",
            listItems: [],
            code: new Date().getTime() % 10000,
        } as List;

        const ref = await addDoc(coll, newList);

        console.log("Created new list: ", ref.id);

        this.setSelectedListId(ref.id);
        this.addListLocally(ref.id);
    }

    async getListData(listId: string): Promise<List | null> {
        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        const snap = await getDoc(listRef);

        if (!snap.exists()) {
            return null;
        }

        const data = snap.data();

        return { ...data, id: snap.id } as List;
    }

    async setListData(listId: string, data: List) {
        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        await updateDoc(listRef, data);

        const inAvailableLists = this.availableLists.find((list) => list.id === listId);
        inAvailableLists && Object.assign(inAvailableLists, data);

        this.options.onSelectedListDataChange?.(data);
        this.options.onAvailableListsChange?.(this.availableLists);
    }

    async duplicateList(list: List) {
        const coll = collection(this.firestore, "lists");
    
        const { id, ...newList } = {
            ...list,
            listTitle: list.listTitle,
            code: new Date().getTime() % 10000,
        };
    
        const ref = await addDoc(coll, newList as List);
    
        // Add the new list locally
        this.addListLocally(ref.id);
    }

    async #pushSelectedListData() {
        if (!this.selectedListId) {
            throw new Error("No list selected");
        }

        await this.setListData(this.selectedListId, this.selectedListData);
    }

    async deleteList(listId: string) {
        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        await deleteDoc(listRef);
    }

    itemsToAdd: InListItem[] = [];

    addItemToList(itemId: string | null, customName: string | null): InListItem {
        if (itemId && customName) {
            throw new Error("Cannot provide both itemId and name");
        }

        const newItem: InListItem = {
            id: new Date().getTime(),
            itemId: itemId,
            customItemName: customName,
            itemAmount: 1,
            itemChecked: false,
            itemCheckedByUsername: "",
            itemUnit: "pcs",
        };

        this.itemsToAdd.push(newItem);

        this.options.onItemsToAddChange?.(this.itemsToAdd);

        return newItem;
    }

    removeItemToAdd(inListItemId: number) {
        this.itemsToAdd = this.itemsToAdd.filter((item) => item.id !== inListItemId);
        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    clearItemsToAdd() {
        this.itemsToAdd = [];
        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    setItemToAdd(itemId: string | null, customName: string | null) {
        this.itemsToAdd = [];
        this.addItemToList(itemId, customName);
    }

    async commitAddingItems(): Promise<void> {
        const listData = this.selectedListData;

        if (!listData) {
            throw new Error("No list selected");
        }

        const newListItems = (listData.listItems || []).concat(this.itemsToAdd);

        if (!this.selectedListId) {
            throw new Error("No list selected");
        }

        const listRef = doc(collection(this.firestore, "lists"), this.selectedListId);

        await updateDoc(listRef, {
            listItems: newListItems,
        });

        // Add to recently used items
        for (const item of this.itemsToAdd) {
            this.#itemManager.storeRecentlyUsedItem(
                item.itemId ?? "_custom_" + item.customItemName,
                item.itemAmount,
                item.itemUnit
            );
        }

        this.itemsToAdd = [];
        this.options.onItemsToAddChange?.(this.itemsToAdd);

        this.refreshSelectedListData();
    }

    getAmountOnList(itemId: string): string {
        const listData = this.selectedListData;

        if (!listData?.listItems) {
            return "";
        }

        const itemsOnList = listData.listItems.filter((item) => item.itemId === itemId);

        if (itemsOnList.length === 0) {
            return "";
        }

        const totalAmount = itemsOnList.reduce(
            (sum, item) => sum + (typeof item.itemAmount === "number" ? item.itemAmount : 0),
            0
        );

        return totalAmount + " " + itemsOnList[0].itemUnit;
    }

    #increaseInListItemAmount(inListItem: InListItem) {
        if (typeof inListItem.itemAmount === "string") {
            throw new Error("Cannot increase amount of custom amount item");
        }

        if (inListItem.itemUnit === "pcs") {
            inListItem.itemAmount++;
        }

        if (inListItem.itemUnit === "ml") {
            inListItem.itemAmount += 100;
        }

        if (inListItem.itemUnit === "g") {
            inListItem.itemAmount += 100;
        }
    }

    #decreaseInListItemAmount(inListItem: InListItem) {
        if (typeof inListItem.itemAmount === "string") {
            throw new Error("Cannot decrease amount of custom amount item");
        }

        if (inListItem.itemAmount > 1 && inListItem.itemUnit === "pcs") {
            inListItem.itemAmount--;
        }

        if (inListItem.itemUnit === "ml") {
            inListItem.itemAmount -= 100;
        }

        if (inListItem.itemUnit === "g") {
            inListItem.itemAmount -= 100;
        }
    }

    #findItemToAdd(inListItemId: number): InListItem {
        const item = this.itemsToAdd.find((item) => item.id === inListItemId);

        if (!item) {
            throw new Error(`Item ${inListItemId} not found`);
        }

        return item;
    }

    increaseAmountToAdd(inListItemId: number) {
        const item = this.#findItemToAdd(inListItemId);

        this.#increaseInListItemAmount(item);
        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    decreaseAmountToAdd(inListItemId: number) {
        const item = this.#findItemToAdd(inListItemId);

        this.#decreaseInListItemAmount(item);
        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    setAmountToAdd(inListItemId: number, amount: number | string, unit: ItemAmountUnit) {
        const item = this.#findItemToAdd(inListItemId);

        item.itemAmount = amount;
        item.itemUnit = unit;

        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    #findInSelectedListItem(inListItemId: number): InListItem {
        if (!this.selectedListData) {
            throw new Error("No list selected");
        }

        const item = this.selectedListData.listItems.find((item) => item.id === inListItemId);

        if (!item) {
            throw new Error(`Item ${inListItemId} not found`);
        }

        return item;
    }

    async setItemAmountInSelected(inListItemId: number, amount: number | string, unit: ItemAmountUnit) {
        const item = this.#findInSelectedListItem(inListItemId);

        item.itemAmount = amount;
        item.itemUnit = unit;

        await this.#pushSelectedListData();
    }

    async increaseItemAmountInSelected(inListItemId: number) {
        const item = this.#findInSelectedListItem(inListItemId);

        this.#increaseInListItemAmount(item);

        await this.#pushSelectedListData();
    }

    async decreaseItemAmountInSelected(inListItemId: number) {
        const item = this.#findInSelectedListItem(inListItemId);

        this.#decreaseInListItemAmount(item);

        await this.#pushSelectedListData();
    }

    async toggleItemChecked(listId: string, inListItemId: number): Promise<void> {
        const data = await this.getListData(listId);
        const item = data.listItems.find((item) => item.id === inListItemId);

        console.log(data);

        if (!item) {
            console.error(`Item ${inListItemId} not found`);
            return;
        }

        item.itemChecked = !item.itemChecked;

        if (item.itemChecked) {
            item.itemCheckedByUsername = this.#userManager.getUsername();
        } else {
            item.itemCheckedByUsername = null;
        }

        await this.setListData(listId, data);
    }

    lastDeletedItems: InListItem[] = [];
    lastDeletedListId: string | null = null;

    async deleteAllCheckedItems(listId: string): Promise<void> {
        const data = await this.getListData(listId);
        const checkedOffItems = data.listItems.filter((item) => item.itemChecked);

        this.lastDeletedItems = checkedOffItems;
        this.lastDeletedListId = listId;

        data.listItems = data.listItems.filter((item) => !item.itemChecked);

        await this.setListData(listId, data);
    }

    async undoDelete(): Promise<void> {
        const data = await this.getListData(this.lastDeletedListId);

        data.listItems = data.listItems.concat(this.lastDeletedItems);
        this.lastDeletedItems = [];

        await this.setListData(this.lastDeletedListId, data);
    }

    lastDeletedItem: InListItem | null = null;

    async deleteItemFromList(listId: string, inListItemId: number): Promise<void> {
        const data = await this.getListData(listId);

        this.lastDeletedItems = data.listItems.filter((item) => item.id === inListItemId);
        this.lastDeletedListId = listId;
        data.listItems = data.listItems.filter((item) => item.id !== inListItemId);

        await this.setListData(listId, data);
    }

    async addRecentlyUsedItemToAddedItems(item: RecentlyUsedItem) {
        const newItem = this.addItemToList(item.itemId, null);

        newItem.itemAmount = item.amount;
        newItem.itemUnit = item.unit;

        this.options.onItemsToAddChange?.(this.itemsToAdd);

        console.log("Added recently used item to added items: ", item);
    }

    async setListTitle(listId: string, newName: string) {
        const data = await this.getListData(listId);

        data.listTitle = newName;

        await this.setListData(listId, data);
    }

    async importList(code: number) {
        const coll = collection(this.firestore, "lists");

        const q = query(coll, where("code", "==", code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 0) {
            throw new Error("List not found");
        }

        const ref = querySnapshot.docs[0];

        this.addListLocally(ref.id);
        this.setSelectedListId(ref.id);
    }
}
