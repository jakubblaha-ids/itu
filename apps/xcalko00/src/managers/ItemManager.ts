import { ItemManagerBase, type InListItem, type ItemAmountUnit } from 'backend';

export class ItemManager extends ItemManagerBase {
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
}
