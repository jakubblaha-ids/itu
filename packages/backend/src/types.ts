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
    listTitle: string;
    listItems: InListItem[];
};

export type Item = {
    id: string;
    name: string;
};
