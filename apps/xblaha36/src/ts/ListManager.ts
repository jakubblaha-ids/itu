import { derived, writable, type Writable } from 'svelte/store';
import { ListManagerBase, type ListManagerBaseOptions } from 'backend';
import type { InListItem, ItemManagerBase, List, UserManagerBase } from 'backend';
import { config } from './Config';
import { itemManager } from './global';

function getInListItemName(item: InListItem) {
	return item.itemId ? itemManager.getNameOfitemId(item.itemId) : item.customItemName;
}

function inListItemsAlphaCompare(a: InListItem, b: InListItem) {
	const nameA = getInListItemName(a)!.toUpperCase();
	const nameB = getInListItemName(b)!.toUpperCase();

	if (nameA < nameB) {
		return -1;
	}

	if (nameA > nameB) {
		return 1;
	}

	return 0;
}

function inListItemsCategoryCompare(a: InListItem, b: InListItem) {
	const strA = (itemManager.getCategoryNameOfItemId(a.itemId) + getInListItemName(a)).toUpperCase();

	const strB = (itemManager.getCategoryNameOfItemId(b.itemId) + getInListItemName(b)).toUpperCase();

	if (strA < strB) {
		return -1;
	}

	if (strA > strB) {
		return 1;
	}

	return 0;
}

export class ListManager extends ListManagerBase {
	selectedListDataStore: Writable<List | null> = writable(null);
	availableListsStore: Writable<List[]> = writable([]);
	itemsToAddStore: Writable<InListItem[]> = writable([]);
	addItemHighlightId = writable<number>(0);
	highlightId = writable<number>(0);

	sortedInListItemsStore = derived(
		[this.selectedListDataStore, config],
		([$selectedListData, $config]) => {
			const sorting = $config.sorting;

			const sortCompare =
				sorting === 'alpha' ? inListItemsAlphaCompare : inListItemsCategoryCompare;

			if (!$selectedListData) {
				return [];
			}

			return $selectedListData.listItems.toSorted(sortCompare);
		}
	);

	constructor(
		itemManager: ItemManagerBase,
		userManager: UserManagerBase,
		options: ListManagerBaseOptions = {}
	) {
		super(itemManager, userManager, {
			...options,
			onSelectedListDataChange: (listData) => {
				this.selectedListDataStore.set(listData);

				console.log('Selected list data: ', listData);
			},
			onItemsToAddChange: (items) => {
				this.itemsToAddStore.set(items);
				console.log('Items to add: ', items);
			},
			onAvailableListsChange: (lists) => {
				this.availableListsStore.set(lists);
				console.log('Available lists: ', lists);
			}
		});
	}

	setListHighlightIndex(index: number) {
		const listId = this.selectedListId;
		localStorage.setItem('listHighlightIndex_' + listId, index.toString());

		this.displayedListHighlightIndex.set(index);
	}

	getListHighlightIndex(listId: string): number {
		return parseInt(localStorage.getItem('listHighlightIndex_' + listId) || '0');
	}

	displayedListHighlightIndex = writable(0);

	override async setSelectedListId(listId: string) {
		super.setSelectedListId(listId);

		this.displayedListHighlightIndex.set(this.getListHighlightIndex(listId));
	}
}
