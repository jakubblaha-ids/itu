import type { Item, ItemAmountUnit } from "./types";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { ResourceManagerBase } from "./ResourceManagerBase";
import { items } from "./items";

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
        if (!itemId) {
            return "N/A";
        }

        if (itemId.startsWith("_custom_")) {
            return itemId.replace("_custom_", "");
        }

        const items = this.availableItems;
        const item = items.find((i) => i.id === itemId);

        if (item) {
            return item.name;
        }

        return "Unknown item";
    }

    getCategoryNameOfItemId(itemId: string | null) {
        if (!itemId) {
            return "Custom";
        }

        const items = this.availableItems;
        const item = items.find((i) => i.id === itemId);

        if (item) {
            return item.categoryName;
        }

        return "Unknown category";
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

    async uploadItems() {
        const coll = collection(this.firestore, "items");

        for (const item of items) {
            await addDoc(coll, {
                name: item.name,
                categoryName: item.categoryName,
            });
        }
    }
}
