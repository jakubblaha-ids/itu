import { ListManagerBase, type ListManagerBaseOptions } from 'backend';
import type { InListItem, ItemAmountUnit, ItemManagerBase, List, RecentlyUsedItem, UserManagerBase } from 'backend';
import { ref, inject } from 'vue';
import type { ItemManager } from '@/managers/ItemManager';
import { itemManager } from './list';

export class ListManager extends ListManagerBase {
    constructor(
		itemManager: ItemManagerBase,
		userManager: UserManagerBase,
		options: ListManagerBaseOptions = {}
	) {
		super(itemManager, userManager, options);
	}

	
	listsWithAmountOfUncheckedItems: { [key: string]: number } = {};

	computeAmount():void{
		const lists = this.availableLists;
		for (let index = 0; index < lists.length; index++) {
			this.listsWithAmountOfUncheckedItems[lists[index].id] = lists[index].listItems.filter(item => !item.itemChecked).length;
		}
	}

	getAmountOfUncheckedItems(listId: string): number {
		var num: number = 0;
		this.getListData(listId).then((list) => {
			if (!list) {
				console.log("List not found");
				return 0;
			}
			num = list.listItems.filter((item) => !item.itemChecked).length;
			console.log(num);
			if (num === undefined) {
				return 0;
			}
			console.log("vracim " + num);
			return num;
			});
			console.log(num);
		return num;
	}

	isToBeAdded(itemId: string|null, itemName: string|null): InListItem | null {
		if(itemId){
			for(const item of this.selectedListData?.listItems || []){
				if(item.itemId === itemId){
					console.log("found" + item.itemId);
					return item;
				}
			}
			for (const item of this.itemsToAdd) {
				if (item.itemId === itemId) {
					console.log("found" + item.itemId);
					return item;
				}
			}
		}
		if(itemName){
			for(const item of this.selectedListData?.listItems || []){
				if(item.customItemName === itemName){
					console.log("found" + item.customItemName);
					return item;
				}
			}
			for (const item of this.itemsToAdd) {
				if (item.customItemName === itemName) {
					console.log("found" + item.customItemName);
					return item;
				}
			}
		}
		return null;
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

	recentlyUsedToBeAdded(itemId: string, amount: number|string, unit: ItemAmountUnit): void {
		if(itemId.startsWith("_custom_")){
			itemId = itemId.replace("_custom_", "");
		}

		console.log(itemId);

		const newItem: InListItem = {
            id: new Date().getTime(),
            itemId: itemId,
            customItemName: itemId,
            itemAmount: amount,
            itemChecked: false,
            itemCheckedByUsername: "",
            itemUnit: unit,
        };

        this.itemsToAdd.push(newItem);

        this.options.onItemsToAddChange?.(this.itemsToAdd);
	}

	sort(id: string, sortOrder: string, itemManager: ItemManager, list: List|null): List {

		if(sortOrder == 'Name'){
			list?.listItems.sort((a, b) => {
				if(!a.customItemName || !b.customItemName){ //check to silence warning
				  return 0;
				}
				let nameA = a.customItemName.toUpperCase();
				let nameB = b.customItemName.toUpperCase();
				return nameA < nameB ? -1 : 1;
			});
			return list!;
		}
		if(sortOrder == 'Category'){
			list?.listItems.sort((a, b) => {
				let catA = itemManager.getCategoryNameOfItemId(a.itemId).toUpperCase();
				let catB = itemManager.getCategoryNameOfItemId(b.itemId).toUpperCase();
				return catA < catB ? -1 : 1;
			});
			return list!;
		}
		return list!;
	}

	async uncheckAllItems(listId: string): Promise<void> {
		const list = await this.getListData(listId);
		if (!list) {
			return;
		}		
		for (const item of list.listItems) {
			if(item.itemChecked){
				await this.toggleItemChecked(list.id, item.id);
			}
		}
	}

	getCategories(list: List): string[]{
		var categories: string[] = [];
		for(const item of list.listItems){
			let cat = itemManager.getCategoryNameOfItemId(item.itemId);
			if(!categories.includes(cat))
				categories.push(cat);
		}
		return categories;
	}
}	
