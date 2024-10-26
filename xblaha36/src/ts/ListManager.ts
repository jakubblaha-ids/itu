import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	updateDoc,
	type Unsubscribe
} from 'firebase/firestore';
import { db } from './stores';
import { get, writable } from 'svelte/store';
import type { InListItem, List } from './types';

export class ListManager {
	selectedListId = writable<string>('');
	selectedListData = writable<List>();

	#selectedListUnsub: Unsubscribe | null = null;

	constructor() {
		this.selectedListId.subscribe((val) => {
			if (this.#selectedListUnsub) {
				this.#selectedListUnsub();
			}

			console.log('Selected list ID changed to: ' + val);

			if (!val) {
				return;
			}

			const coll = collection(get(db), 'lists');
			const listRef = doc(coll, val);

			this.#selectedListUnsub = onSnapshot(listRef, (snap) => {
				const data = snap.data();

				this.selectedListData.set(data as List);
			});
		});

		this.selectedListData.subscribe((val) => {
			console.log('Selected list data: ', val);
		});

		db.subscribe((val) => {
			if (val) {
				this.loadLastSelectedList();
			}
		});

		this.selectedListId.subscribe((val) => {
			if (val) {
				this.displayedListHighlightIndex.set(this.getListHighlightIndex(val));
			}
		});
	}

	async loadLastSelectedList() {
		// Make it the first list in the DB for now
		const coll = collection(get(db), 'lists');
		const lists = await getDocs(coll);
		const firstList = lists.docs[0];

		this.selectedListId.set(firstList.id);
	}

	async createList() {
		const coll = collection(get(db), 'lists');

		const newList: List = {
			listTitle: 'New list',
			listItems: []
		};

		const ref = await addDoc(coll, newList);

		this.selectedListId.set(ref.id);
	}

	// async refreshSelectedListData() {
	// 	const coll = collection(get(db), 'lists');

	// 	getDoc(doc(coll, get(this.selectedListId))).then((snap) => {
	// 		const data = snap.data();

	// 		this.selectedListData.set(data as List);
	// 	});
	// }

	itemsToAdd = writable<InListItem[]>([]);

	async addItemToList(itemId: string | null, customName: string | null) {
		if (itemId && customName) {
			throw new Error('Cannot provide both itemId and name');
		}

		const newItem: InListItem = {
			itemId: itemId,
			customItemName: customName,
			itemAmount: 1,
			itemChecked: false,
			itemCheckedByUserId: '',
			itemUnit: ''
		};

		this.itemsToAdd.update((val) => val.concat(newItem));
	}

	async commitAddingItems() {
		const listData = get(this.selectedListData);
		const itemsToAdd = get(this.itemsToAdd);

		const newListItems = (listData.listItems || []).concat(itemsToAdd);

		await updateDoc(doc(collection(get(db), 'lists'), get(this.selectedListId)), {
			listItems: newListItems
		});

		this.itemsToAdd.set([]);
	}

	getAmountOnList(itemId: string): string {
		const listData = get(this.selectedListData);

		if (!listData.listItems) {
			return '';
		}

		const itemOnList = listData.listItems.find((item) => item.itemId === itemId);

		if (!itemOnList) {
			return '';
		}

		return itemOnList.itemAmount + ' ' + itemOnList.itemUnit;
	}

	addItemHighlightIndex = writable<number>(0);

	increaseAmountToAdd() {
		this.itemsToAdd.update((val) => {
			const item = val[get(this.addItemHighlightIndex)];

			if (item.itemUnit === '') {
				item.itemAmount++;
			}

			if (item.itemUnit === 'ml') {
				item.itemAmount += 100;
			}

			if (item.itemUnit === 'g') {
				item.itemAmount += 100;
			}

			return val;
		});
	}

	decreaseAmountToAdd() {
		this.itemsToAdd.update((val) => {
			const item = val[get(this.addItemHighlightIndex)];

			if (item.itemUnit === '') {
				item.itemAmount--;
			}

			if (item.itemUnit === 'ml') {
				item.itemAmount -= 100;
			}

			if (item.itemUnit === 'g') {
				item.itemAmount -= 100;
			}

			return val;
		});
	}

	setAmountToAdd(amount: number, unit: string) {
		this.itemsToAdd.update((val) => {
			const item = val[get(this.addItemHighlightIndex)];

			item.itemAmount = amount;
			item.itemUnit = unit;

			return val;
		});
	}

	selectLastToAdd() {
		this.addItemHighlightIndex.set(get(this.itemsToAdd).length - 1);
	}

	displayedListHighlightIndex = writable(0);

	setListHighlightIndex(index: number) {
		const listId = get(this.selectedListId);
		localStorage.setItem('listHighlightIndex_' + listId, index.toString());

		this.displayedListHighlightIndex.set(index);
	}

	getListHighlightIndex(listId: string): number {
		return parseInt(localStorage.getItem('listHighlightIndex_' + listId) || '0');
	}

	checkHighlighted() {
		const list = get(this.selectedListData);
		const index = get(this.displayedListHighlightIndex);
		const item = list.listItems[index];

		item.itemChecked = !item.itemChecked;

		this.selectedListData.update((data) => {
			data.listItems = list.listItems;

			return data;
		});
	}
}
