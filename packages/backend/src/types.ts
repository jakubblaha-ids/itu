export type ItemAmountUnit = "g" | "ml" | "pcs" | "custom";

export type InListItem = {
    id: number;
    itemId: string | null;
    customItemName: string | null;
    itemAmount: number | string;
    itemUnit: ItemAmountUnit;
    itemChecked: boolean;
    itemCheckedByUsername: string;
};

export type List = {
    id: string;
    code: number;
    listTitle: string;
    listItems: InListItem[];
};

export type Item = {
    id: string;
    name: string;
    categoryName: string;
};

export type RecentlyUsedItem = {
    itemId: string;
    amount: number | string;
    unit: ItemAmountUnit;
    timestamp: number;
};
