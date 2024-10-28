import type { Item, ItemAmountUnit } from "./types";
import { collection, getDocs } from "firebase/firestore";
import { ResourceManagerBase } from "./ResourceManagerBase";

export type RecentlyUsedItem = {
    itemId: string;
    amount: number | string;
    unit: ItemAmountUnit;
    timestamp: number;
};

export class ItemManagerBase extends ResourceManagerBase {
    availableItems: Item[] = [];

    async refreshAvailableItems() {
        const coll = collection(this.firestore, "items");
        const items = await getDocs(coll);

        this.availableItems = items.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            } as Item;
        });
    }

    getNameOfitemId(itemId: string): string {
        const items = this.availableItems;
        const item = items.find((i) => i.id === itemId);

        if (item) {
            return item.name;
        }

        return "Unknown item";
    }

    getAvailableItems(filter: string) {
        return this.availableItems.filter((item) => {
            return item.name.toLowerCase().includes(filter.toLowerCase());
        });
    }

    getRecentlyUsedItems(): RecentlyUsedItem[] {
        const recentlyUsed = localStorage.getItem("recentlyUsedItems");
        const parsed = recentlyUsed ? JSON.parse(recentlyUsed) : [];

        return parsed;
    }

    storeRecentlyUsedItem(itemId: string, amount: number | string, unit: ItemAmountUnit) {
        const recentlyUsed = this.getRecentlyUsedItems();
        const existing = recentlyUsed.find((item) => item.itemId === itemId);

        if (existing) {
            existing.timestamp = Date.now();
            existing.amount = amount;
            existing.unit = unit;
        } else {
            recentlyUsed.push({
                itemId,
                amount,
                unit,
                timestamp: Date.now(),
            });
        }

        localStorage.setItem("recentlyUsedItems", JSON.stringify(recentlyUsed));
    }
}
