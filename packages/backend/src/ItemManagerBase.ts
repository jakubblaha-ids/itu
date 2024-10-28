import type { Item } from "./types";
import { collection, getDocs } from "firebase/firestore";
import { ResourceManagerBase } from "./ResourceManagerBase";

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

    // storeRecentlyUsedItem(itemId: string, ) {}
}
