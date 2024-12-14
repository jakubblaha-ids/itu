import { ItemManagerBase, type InListItem, type ItemAmountUnit, type RecentlyUsedItem } from 'backend';

export class ItemManager extends ItemManagerBase { 

    getRecentlyUsedItemsAsItems(): RecentlyUsedItem[] {
        var items = this.getRecentlyUsedItems();
        var recentlyUsed: RecentlyUsedItem[] = [];
        for (const item of items) {
            recentlyUsed.push({
                itemId: (item.itemId ? item.itemId.replace("_custom_", "") : ''),
                amount: item.amount,
                unit: item.unit,
                timestamp: item.timestamp,
            });
        }

        return recentlyUsed;
    }
}
