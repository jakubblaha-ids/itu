import { get, writable } from 'svelte/store';
import type { Item } from './types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './stores';

export class ItemManager {
	availableItems = writable<Item[]>([]);

	async refreshAvailableItems() {
		const coll = collection(get(db), 'items');
		const items = await getDocs(coll);

		this.availableItems.set(
			items.docs.map((doc) => {
				return {
					id: doc.id,
					...doc.data()
				} as Item;
			})
		);
	}

	getNameOfitemId(itemId: string): string {
		const items = get(this.availableItems);
		const item = items.find((i) => i.id === itemId);

		if (item) {
			return item.name;
		}

		return 'Unknown item';
	}

	getSuggestedQuantities(itemId: string | null) {
		return [
			{ amount: 3, unit: '' },
			{ amount: 4, unit: '' },
			{ amount: 5, unit: '' },
			{ amount: 8, unit: '' },
			{ amount: 10, unit: '' },
			{ amount: 100, unit: 'g' },
			{ amount: 200, unit: 'g' },
			{ amount: 250, unit: 'g' },
			{ amount: 300, unit: 'g' }
		];
	}
}
