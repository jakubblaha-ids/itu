import { ItemManagerBase } from './base/ItemManagerBase';

export class ItemManager extends ItemManagerBase {
	constructor() {
		super();
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
