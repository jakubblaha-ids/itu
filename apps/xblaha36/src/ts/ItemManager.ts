// Jakub Blaha, xblaha36

import { ItemManagerBase, type InListItem, type ItemAmountUnit } from 'backend';

export class ItemManager extends ItemManagerBase {
	/**
	 * Returns a list of suggested quantities for a given item. At the moment, the amoutns
	 * are hardcoded.
	 *
	 * @param itemId - The ID of the item for which to get suggested quantities. Can be null.
	 * @returns An array of objects, each containing an amount and a unit.
	 */
	getSuggestedQuantities(itemId: string | null): { amount: number; unit: ItemAmountUnit }[] {
		return [
			{ amount: 3, unit: 'pcs' },
			{ amount: 4, unit: 'pcs' },
			{ amount: 5, unit: 'pcs' },
			{ amount: 8, unit: 'pcs' },
			{ amount: 10, unit: 'pcs' },
			{ amount: 100, unit: 'g' },
			{ amount: 200, unit: 'g' },
			{ amount: 250, unit: 'g' },
			{ amount: 300, unit: 'g' }
		];
	}

	/**
	 * Retrieves the name of an item in the list using the id stored in the
	 * in-list-item.
	 *
	 * @param item - The item for which to get the name.
	 * @returns The custom name of the item if it exists, otherwise the name associated with the item's ID.
	 */
	getInListItemName(item: InListItem): string {
		return item.customItemName || this.getNameOfitemId(item.itemId!);
	}
}
