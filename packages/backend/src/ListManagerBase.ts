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
    // A callback that will be called whenever the selected list changes.
    // Use to propagate this change into the app, for example when a
    // list is imported.
    onSelectedListChange?: (listId: string) => void;

    // Called whenever data of the selected list change in the DB.
    onSelectedListDataChange?: (listData: List) => void;

    // Called when the array `itemsToAdd` is changed.
    onItemsToAddChange?: (items: InListItem[]) => void;

    // Called when available lists are loaded from the DB.
    // Available lists are lists that are locally added and found
    // in the DB.
    onAvailableListsChange?: (lists: List[]) => void;
}

export class ListManagerBase extends ResourceManagerBase {
    options: ListManagerBaseOptions;

    selectedListId: string | null = null;

    // Automatically updated when `selectedListId` changes.
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

    /**
     * Adds a list to the local storage if it is not already present.
     *
     * @param listId - The ID of the list to be added.
     * @returns A promise that resolves when the list has been added and the available lists have been refreshed.
     *
     * @remarks
     * This method checks if the list is already present in the local storage under the key "addedLists".
     * If the list is already present, the method returns early.
     * Otherwise, the list ID is added to the array of lists in local storage and the available lists are refreshed.
     */
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

    /**
     * Removes a list from the local storage by its ID. Call when
     * the user wants to remove a list from the app. The list will
     * not be deleted from the databse.
     *
     * @param listId - The ID of the list to be removed.
     */
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

    /**
     * Retrieves the list of locally added list IDs from the local storage.
     *
     * @returns {string[]} An array of list IDs that were added locally.
     * If no list IDs are found, an empty array is returned.
     */
    getLocallyAddedListIds() {
        const val = localStorage.getItem("addedLists");
        const parsed = JSON.parse(val || "[]");

        return parsed;
    }

    /**
     * Refreshes the list of available lists by fetching the locally added list IDs
     * and querying the Firestore database for those lists. Updates the `availableLists`
     * property with the fetched lists and triggers the `onAvailableListsChange` callback
     * if it is defined.
     *
     * @returns {Promise<void>} A promise that resolves when the available lists have been refreshed.
     */
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

    /**
     * Sets the selected list ID and updates the selected list data accordingly.
     *
     * @param listId - The ID of the list to be selected.
     *
     * This method performs the following actions:
     * - Updates the `selectedListId` property with the provided `listId`.
     * - Stores the `listId` in the local storage under the key "lastSelectedList".
     * - Triggers the `onSelectedListChange` callback with the new `listId`.
     */
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

    /**
     * Refreshes the data for the currently selected list.
     *
     * If a list is selected, it fetches the data for the selected list using the
     * `getListData` method, updates the `selectedListData` property with the fetched data,
     * and triggers the `onSelectedListDataChange` callback with the new data. If no list is
     * selected, `selectedListData` is set to `null`.
     *
     * @returns {Promise<void>} A promise that resolves when the selected list data has been refreshed.
     */
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

    /**
     * Selects the last selected list from local storage and sets it as the current selected list.
     *
     * This method retrieves the last selected list ID from the local storage and, if it exists,
     * sets it as the currently selected list by calling the `setSelectedListId` method.
     * Snapshot listeners are updates accordingly by calling `setSelectedListId`.
     *
     * @returns {Promise<void>} A promise that resolves when the selected list ID has been set.
     */
    async selectLastSelectedList() {
        const lastSelected = localStorage.getItem("lastSelectedList");

        if (lastSelected) {
            await this.setSelectedListId(lastSelected);
        }
    }

    /**
     * Create a new list in the DB and set it as selected. Update listeners accordingly.
     */
    async createList(): Promise<void> {
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

    /**
     * Retrieve list data from the DB based on provided ID.
     * @param listId
     * @returns Promise that resolves with list data or null if not found.
     */
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

    /**
     * Updates list data in the DB.
     * @param listId ID of the list to update.
     * @param data New list data.
     * @returns A promise that resolves when the data of the list is updated.
     */
    async setListData(listId: string, data: List): Promise<void> {
        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        await updateDoc(listRef, data);

        const inAvailableLists = this.availableLists.find((list) => list.id === listId);
        inAvailableLists && Object.assign(inAvailableLists, data);

        // Questionable, but leaving it here to not break the apps.
        this.options.onSelectedListDataChange?.(data);

        this.options.onAvailableListsChange?.(this.availableLists);
    }

    /**
     * Creates a copy of a list in the DB.
     * @param list The list data to duplicate.
     */
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

    /**
     * Push the data of the currently selected list to the DB.
     *
     * @returns A promise that resolves when the data is successfully pushed to the DB.
     */
    async #pushSelectedListData(): Promise<void> {
        if (!this.selectedListId) {
            throw new Error("No list selected");
        }

        await this.setListData(this.selectedListId, this.selectedListData);
    }

    /**
     * Delete a list from the DB.
     * @param listId The ID of the list to delete from the DB.
     */
    async deleteList(listId: string) {
        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        await deleteDoc(listRef);
    }

    // A list of in-list-items to that are to be added to the list in bulk
    // from the add-items screen.
    itemsToAdd: InListItem[] = [];

    /**
     * Add an item to the list of in-list-items that will be added to the list once the user commits
     * adding the items. Either itemID or custom name need to be provided, never both. Providing a
     * custom name will result in a custom item being added to the list.
     *
     * Make sure to call `commitAddingItems` to save the changes to the DB.
     *
     * @param itemId ID of the item to add from the `items` collection. (This is not an ID of in-list-item)
     * @param customName
     * @returns The new in-list-item
     */
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

    /**
     * Remove an item from the list of items being added to the currently selected list.
     * @param inListItemId
     */
    removeItemToAdd(inListItemId: number) {
        this.itemsToAdd = this.itemsToAdd.filter((item) => item.id !== inListItemId);
        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    /**
     * Remove all items from the list of items being added to the currently selected list.
     */
    clearItemsToAdd() {
        this.itemsToAdd = [];
        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    /**
     * Clear the list of items being added to a list and add a single new item to the list.
     * Make sure to call `commitAddingItems` to save the changes to the DB.
     * @param itemId
     * @param customName
     */
    setItemToAdd(itemId: string | null, customName: string | null) {
        this.itemsToAdd = [];
        this.addItemToList(itemId, customName);
    }

    /**
     * Saves all in-list-items that are currently in `itemsToAdd` to the DB, to
     * the currently selected list and clears the `itemsToAdd` list.
     *
     * @throws When no list is selected or currently selected list data is not fetched yet.
     * @returns A promise that resolves when the changes are saved in the DB.
     */
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

    /**
     * Returns the amount of an item in the currently selected list as a string composing of the amount
     * and the unit.
     * @param itemId The ID of the an item to retrieve its amount on the currently selected list.
     * @returns A string composed of the amount and the unit.
     */
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

    // The following functions smartly increase or decrease the amounts of in-list-items
    // based on their unit.
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

    /**
     * Smartly increase the amount of an in-list-item in the `itemsToAdd` array.
     * @param inListItemId
     */
    increaseAmountToAdd(inListItemId: number) {
        const item = this.#findItemToAdd(inListItemId);

        this.#increaseInListItemAmount(item);
        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    /**
     * Smartly decrease the amount of an in-list-item in the `itemsToAdd` array.
     * @param inListItemId
     */
    decreaseAmountToAdd(inListItemId: number) {
        const item = this.#findItemToAdd(inListItemId);

        this.#decreaseInListItemAmount(item);
        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    /**
     * Set the amount of an in-list-item in the `itemsToAdd` array.
     * @param inListItemId
     * @param amount Either a number or a string. A string denotes a custom amount.
     * @param unit The unit in case amount is a number, otherwise set to 'custom'.
     */
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

    /**
     * Set the amount of an in-list-item in the currently selected list.
     * @param inListItemId
     * @param amount Either a number or a string. A string denotes a custom amount.
     * @param unit The unit in case amount is a number, otherwise set to 'custom'.
     */
    async setItemAmountInSelected(inListItemId: number, amount: number | string, unit: ItemAmountUnit) {
        const item = this.#findInSelectedListItem(inListItemId);

        item.itemAmount = amount;
        item.itemUnit = unit;

        await this.#pushSelectedListData();
    }

    /**
     * Smartly increase the amount of an in-list-item on the currently selected list.
     * @param inListItemId
     */
    async increaseItemAmountInSelected(inListItemId: number) {
        const item = this.#findInSelectedListItem(inListItemId);

        this.#increaseInListItemAmount(item);

        await this.#pushSelectedListData();
    }

    /**
     * Smartly decrease the amount of an in-list-item on the currently selected list.
     * @param inListItemId
     */
    async decreaseItemAmountInSelected(inListItemId: number) {
        const item = this.#findInSelectedListItem(inListItemId);

        this.#decreaseInListItemAmount(item);

        await this.#pushSelectedListData();
    }

    /**
     * Toggle the checked state of an item in a list and push the changes to the DB.
     * @param listId
     * @param inListItemId
     * @returns A promise that resolves when the changes are pushed to the DB.
     */
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

    // Used for undo actions.
    lastDeletedItems: InListItem[] = [];
    lastDeletedListId: string | null = null;

    /**
     * Deletes all checked items from a list and pushes the changes to the DB.
     * And remembers the list ID in case the user wants to undo the action.
     * @param listId
     * @returns A promise that resolves when the changes have been pushed to the DB.
     */
    async deleteAllCheckedItems(listId: string): Promise<void> {
        const data = await this.getListData(listId);
        const checkedOffItems = data.listItems.filter((item) => item.itemChecked);

        this.lastDeletedItems = checkedOffItems;
        this.lastDeletedListId = listId;

        data.listItems = data.listItems.filter((item) => !item.itemChecked);

        await this.setListData(listId, data);
    }

    /**
     * Restore lastly deleted items from a list and push the changes to the DB.
     * @returns A promise that resolves when changes have been pushed to the DB.
     */
    async undoDelete(): Promise<void> {
        const data = await this.getListData(this.lastDeletedListId);

        data.listItems = data.listItems.concat(this.lastDeletedItems);
        this.lastDeletedItems = [];

        await this.setListData(this.lastDeletedListId, data);
    }

    // For undo action
    lastDeletedItem: InListItem | null = null;

    /**
     * Delete an item from a list, push changes to DB and remeber it for undoing later.
     * @param listId
     * @param inListItemId
     * @returns A promise that resolves when changes have been pushed to the DB.
     */
    async deleteItemFromList(listId: string, inListItemId: number): Promise<void> {
        const data = await this.getListData(listId);

        this.lastDeletedItems = data.listItems.filter((item) => item.id === inListItemId);
        this.lastDeletedListId = listId;
        data.listItems = data.listItems.filter((item) => item.id !== inListItemId);

        await this.setListData(listId, data);
    }

    /**
     * Convenience function which takes a RecentlyUsedItem and adds it to the list of items to add
     * to the currently selected list.
     * @param item
     */
    async addRecentlyUsedItemToAddedItems(item: RecentlyUsedItem): Promise<void> {
        const newItem = this.addItemToList(item.itemId, null);

        newItem.itemAmount = item.amount;
        newItem.itemUnit = item.unit;

        this.options.onItemsToAddChange?.(this.itemsToAdd);

        console.log("Added recently used item to added items: ", item);
    }

    /**
     * Set a new title of a list and push the changes to the DB.
     * @param listId
     * @param newName
     * @returns A promise resolving when changes have been writeen to the DB.
     */
    async setListTitle(listId: string, newName: string): Promise<void> {
        const data = await this.getListData(listId);

        data.listTitle = newName;

        await this.setListData(listId, data);
    }

    /**
     * Find a list in the DB with the provided code, add it locally and set it as
     * the selected list.
     * @param code
     * @returns A promise that resolves when the list is added locally and is set as selected.
     */
    async importList(code: number): Promise<void> {
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
