import type { Item, ItemAmountUnit, RecentlyUsedItem } from "./types";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { ResourceManagerBase } from "./ResourceManagerBase";
import { items } from "./items";

export class ItemManagerBase extends ResourceManagerBase {
    availableItems: Item[] = [];

    /**
     * Fetches items from Firestore, maps them to Item objects, and updates the availableItems array.
     */
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

    /**
     * Returns the name of an item by its itemId. Handles custom items by removing a prefix and returns “Unknown item” if the ID is invalid.
     */
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

    /**
     * Returns the category name of an item by its itemId. Returns “Custom” for null IDs and “Unknown category” if the ID is invalid.
     */
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

    /**
     * Filters availableItems by item name based on the provided filter string (case-insensitive).
     */
    getAvailableItems(filter: string) {
        return this.availableItems.filter((item) => {
            return item.name.toLowerCase().includes(filter.toLowerCase());
        });
    }

    /**
     * Retrieves recently used items from localStorage, returning an array of parsed RecentlyUsedItem objects.
     */
    getRecentlyUsedItems(): RecentlyUsedItem[] {
        const recentlyUsed = localStorage.getItem("recentlyUsedItems");
        const parsed = recentlyUsed ? JSON.parse(recentlyUsed) : [];

        return parsed;
    }

    /**
     * Stores or updates a recently used item in localStorage, setting its timestamp, amount, and unit.
     */
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

    /**
     * Uploads all hardcoded items to Firestore, creating a new document for each item with name and categoryName fields.
     * Use to first populate the items collection.
     */
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
