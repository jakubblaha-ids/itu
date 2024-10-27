import { writable, type Writable } from 'svelte/store';
import { ListManagerBase, type ListManagerBaseOptions } from 'backend';
import type { InListItem, List } from 'backend';

export class ListManager extends ListManagerBase {
	selectedListDataStore: Writable<List | null> = writable(null);
	itemsToAddStore: Writable<InListItem[]> = writable([]);
	addItemHighlightId = writable<number>(0);
	highlightId = writable<number>(0);

	constructor(options: ListManagerBaseOptions = {}) {
		super({
			...options,
			onSelectedListDataChange: (listData) => {
				this.selectedListDataStore.set(listData);

				console.log('Selected list data: ', listData);
			},
			onItemsToAddChange: (items) => {
				this.itemsToAddStore.set(items);
				console.log('Items to add: ', items);
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
