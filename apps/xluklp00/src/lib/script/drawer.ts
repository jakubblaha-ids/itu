import type { Item, ItemAmountUnit, RecentlyUsedItem } from "backend";

export type ItemToAdd = {
    id: string | null;
    inListId: number | null;
    name: string;
};


export type DrawerState = {
    phase: "search" | "add";
    recentlyUsedItems: RecentlyUsedItem[];
    availableItems: Item[];
    itemToAdd: ItemToAdd | null;
    selectedUnit: ItemAmountUnit;
    selectedAmount: number | string;
}