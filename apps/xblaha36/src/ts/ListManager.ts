// Jakub Blaha, xblaha36

import { derived, writable, type Writable } from 'svelte/store';
import { ListManagerBase, type ListManagerBaseOptions } from 'backend';
import type { InListItem, ItemManagerBase, List, UserManagerBase } from 'backend';
import { config } from './Config';
import { itemManager } from './global';

function getInListItemName(item: InListItem) {
	return item.itemId ? itemManager.getNameOfitemId(item.itemId) : item.customItemName;
}

// Used for sorting in-list-items alphabetically
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

// Used for sorting in-list-items by category name alphabetically
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
	// A store that is filled with the data of the currently
	// displayed list (e.g.) the list that the user is navigated to.
	selectedListDataStore: Writable<List | null> = writable(null);

	// A store with imported lists
	availableListsStore: Writable<List[]> = writable([]);

	// A list of in-list-items that the user is currently adding to the selected list
	itemsToAddStore: Writable<InListItem[]> = writable([]);

	// The ID of the currently highlighted item
	highlightId = writable<number>(0);

	// Items from the currently selected list that will be displayed in the UI.
	// Items in this store are already sorted according to the selected sorting criteria.
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
		// Binding of new/updated values from the backend to svelte stores.
		super(itemManager, userManager, {
			...options,
			onSelectedListDataChange: (listData) => {
				this.selectedListDataStore.set(listData);
			},
			onItemsToAddChange: (items) => {
				this.itemsToAddStore.set(items);
			},
			onAvailableListsChange: (lists) => {
				this.availableListsStore.set(lists);
			}
		});
	}

	// Saves highliht index of currently selected list
	setListHighlightIndex(index: number) {
		const listId = this.selectedListId;
		localStorage.setItem('listHighlightIndex_' + listId, index.toString());

		this.displayedListHighlightIndex.set(index);
	}

	// Retrieves highlight index of currently selected list
	getListHighlightIndex(listId: string): number {
		return parseInt(localStorage.getItem('listHighlightIndex_' + listId) || '0');
	}

	displayedListHighlightIndex = writable(0);

	// Change the currently selected list ID (when the user opens a list.)
	override async setSelectedListId(listId: string) {
		super.setSelectedListId(listId);

		this.displayedListHighlightIndex.set(this.getListHighlightIndex(listId));
	}
}
