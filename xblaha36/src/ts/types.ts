export type InListItem = {
	id: number;
	itemId: string | null;
	customItemName: string | null;
	itemAmount: number;
	itemUnit: string;
	itemChecked: boolean;
	itemCheckedByUserId: string;
};

export type List = {
	listTitle: string;
	listItems: InListItem[];
};

export type Item = {
	id: string;
	name: string;
};
