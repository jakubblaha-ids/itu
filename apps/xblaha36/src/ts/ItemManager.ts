import { ItemManagerBase, type ItemAmountUnit } from 'backend';

export class ItemManager extends ItemManagerBase {
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
}
