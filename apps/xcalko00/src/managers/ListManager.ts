/**
 * Autor: Veronika Calkovska (xcalko00)
 */

import { ListManagerBase, type ListManagerBaseOptions } from 'backend';
import type { InListItem, ItemAmountUnit, ItemManagerBase, List, RecentlyUsedItem, UserManagerBase } from 'backend';
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

	/**
	 * Function to compute amounts of not checked items in the lists
	 */
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

			if (num === undefined) {
				return 0;
			}

			return num;
			});

		return num;
	}

	/**
	 * Function checks if item is in the list of items to be added 
	 * 
	 * @param itemId id of item
	 * @param itemName name of item 
	 * @returns 
	 */
	isToBeAdded(itemId: string|null, itemName: string|null): InListItem | null {
		if(itemId){
			for(const item of this.selectedListData?.listItems || []){
				if(item.itemId === itemId){
					return item;
				}
			}
			for (const item of this.itemsToAdd) {
				if (item.itemId === itemId) {
					return item;
				}
			}
		}
		if(itemName){
			for(const item of this.selectedListData?.listItems || []){
				if(item.customItemName === itemName){
					return item;
				}
			}
			for (const item of this.itemsToAdd) {
				if (item.customItemName === itemName) {
					return item;
				}
			}
		}
		return null;
	}

	/**
	 * Function edits item in the list with new parameters
	 * 
	 * @param list list where item is to be edited
	 * @param newName new name of item
	 * @param newAmount new amount of item
	 * @param id id of item to be edited
	 * @param unit new unit of item
	 */
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

	/**
	 * Adds recently used item in the list of items to be added
	 * 
	 * @param itemId 
	 * @param amount 
	 * @param unit 
	 */
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

	/**
	 * 
	 * @param list 
	 * @returns array of all categories that are in the list
	 */
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
