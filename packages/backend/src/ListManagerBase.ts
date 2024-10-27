import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    updateDoc,
    type Unsubscribe,
} from "firebase/firestore";
import type { InListItem, List } from "./types";
import { ResourceManagerBase } from "./ResourceManagerBase";

export interface ListManagerBaseOptions {
    onSelectedListChange?: (listId: string) => void;
    onSelectedListDataChange?: (listData: List) => void;
    onItemsToAddChange?: (items: InListItem[]) => void;
}

export class ListManagerBase extends ResourceManagerBase {
    options: ListManagerBaseOptions;

    selectedListId: string | null = null;
    selectedListData: List | null = null;

    #selectedListUnsub: Unsubscribe | null = null;

    constructor(options: ListManagerBaseOptions = {}) {
        super();

        this.options = options;
    }

    async setSelectedListId(listId: string) {
        this.selectedListId = listId;
        console.log("Selected list ID changed to: " + listId);

        if (this.#selectedListUnsub) {
            this.#selectedListUnsub();
        }

        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        this.#selectedListUnsub = onSnapshot(listRef, (snap) => {
            const data = snap.data();

            this.selectedListData = data as List;

            this.options.onSelectedListDataChange?.(this.selectedListData);
        });

        this.options.onSelectedListChange?.(listId);
    }

    async refreshSelectedListData() {
        if (!this.selectedListId) {
            throw new Error("No list selected");
        }

        this.selectedListData = await this.getListData(this.selectedListId);

        this.options.onSelectedListDataChange?.(this.selectedListData);

        console.log("Selected list data: ", this.selectedListData);
    }

    async selectLastSelectedOrFirstList() {
        // Make it the first list in the DB for now
        const coll = collection(this.firestore, "lists");
        const lists = await getDocs(coll);
        const firstList = lists.docs[0];

        this.setSelectedListId(firstList.id);
    }

    async createList() {
        const coll = collection(this.firestore, "lists");

        const newList: List = {
            listTitle: "New list",
            listItems: [],
        };

        const ref = await addDoc(coll, newList);

        this.setSelectedListId(ref.id);
    }

    async getListData(listId: string) {
        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        const snap = await getDoc(listRef);
        const data = snap.data();

        return data as List;
    }

    async setListData(listId: string, data: List) {
        const coll = collection(this.firestore, "lists");
        const listRef = doc(coll, listId);

        await updateDoc(listRef, data);
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
            itemCheckedByUserId: "",
            itemUnit: "",
        };

        this.itemsToAdd.push(newItem);

        this.options.onItemsToAddChange?.(this.itemsToAdd);

        return newItem;
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

        this.itemsToAdd = [];

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

        const totalAmount = itemsOnList.reduce((sum, item) => sum + item.itemAmount, 0);

        return totalAmount + " " + itemsOnList[0].itemUnit;
    }

    increaseAmountToAdd(inListItemId: number) {
        const item = this.itemsToAdd.find((item) => item.id === inListItemId);

        if (!item) {
            throw new Error("Item not found");
        }

        if (item.itemUnit === "") {
            item.itemAmount++;
        }

        if (item.itemUnit === "ml") {
            item.itemAmount += 100;
        }

        if (item.itemUnit === "g") {
            item.itemAmount += 100;
        }

        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    decreaseAmountToAdd(inListItemId: number) {
        const item = this.itemsToAdd.find((item) => item.id === inListItemId);

        if (!item) {
            throw new Error("Item not found");
        }

        if (item.itemAmount > 1) {
            item.itemAmount--;
        }

        if (item.itemUnit === "ml") {
            item.itemAmount -= 100;
        }

        if (item.itemUnit === "g") {
            item.itemAmount -= 100;
        }

        this.options.onItemsToAddChange?.(this.itemsToAdd);
    }

    setAmountToAdd(inListItemId: number, amount: number, unit: string) {
        console.log({ inListItemId });

        const item = this.itemsToAdd.find((item) => item.id === inListItemId);

        if (!item) {
            throw new Error("Item not found");
        }

        item.itemAmount = amount;
        item.itemUnit = unit;

        this.options.onItemsToAddChange?.(this.itemsToAdd);
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

        await this.setListData(listId, data);
    }
}
