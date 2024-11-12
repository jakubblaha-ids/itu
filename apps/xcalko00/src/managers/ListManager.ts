import { ListManagerBase, type ListManagerBaseOptions } from 'backend';
import type { InListItem, ItemAmountUnit, ItemManagerBase, List, UserManagerBase } from 'backend';
import { ref } from 'vue';

export class ListManager extends ListManagerBase {
    constructor(
		itemManager: ItemManagerBase,
		userManager: UserManagerBase,
		options: ListManagerBaseOptions = {}
	) {
		super(itemManager, userManager, options);
	}

	
	async getAmountOfUncheckedItems(listId: string): Promise<number> {
		const list = ref<List | null>(null);
		list.value = await this.getListData(listId);
		if (!list) {
			return 0;
		}
		const num = list.value?.listItems.filter((item) => !item.itemChecked).length;

		if (num === undefined) {
			return 0;
		}
		return num;
	}

	isToBeAdded(itemName: string): boolean {
		for (const item of this.itemsToAdd) {
			if (item.customItemName === itemName) {
				return true;
			}
		}
		return false;
	}

	async editItem(list: List, newName: string | null, newAmount: number | string, id: number, unit: ItemAmountUnit): Promise<void> {
		var newItem = list.listItems.find((item) => item.id === id);
		newItem!.customItemName = newName;
		newItem!.itemAmount = newAmount;
		newItem!.itemUnit = unit;

		await this.setListData(list.id, list);
	}

	getIdOfImportedList(){
		return this.selectedListId;
	}

	getAmountUnitOfItem(list: List, itemId: string): string {
		var item = list.listItems.find((item) => item.itemId === itemId);
		if (item) {
			return item.itemUnit;
		}
		return 'pcs';
	}
}	
