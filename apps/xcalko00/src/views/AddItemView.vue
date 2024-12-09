<script setup lang="ts">
import { ref, inject, onMounted, reactive, watch } from 'vue';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { type List, type Item, type InListItem, type ItemAmountUnit, type RecentlyUsedItem } from 'backend';
import type { ListManager } from '@/managers/ListManager';
import type { ItemManager } from '@/managers/ItemManager';
import type { UserManager } from '@/managers/UserManager';
import AmountUnitDropdown from '@/components/AmountUnitDropdown.vue';
import RecentlyUsedTable from '@/components/RecentlyUsedTable.vue';

const listManager = inject('listManager') as ListManager;
const itemManager = inject('itemManager') as ItemManager;

const router = useRouter();

const list = reactive(ref<List | null>(null));
const filter = ref('');
const filterItems = ref<Item[]>([]);
const selectedItemId = ref(0);
var text: string = '1';
const newAmount = ref(0); 
const newUnit = ref('pcs'); 

const props = defineProps<{
    id: string;
}>();

onMounted(async () => {
  if (listManager) {
    list.value = await listManager.getListData(props.id);
    listManager.selectedListData = list.value;
    listManager.selectedListId = props.id;
  }
});

const selected = (item: Item): boolean => {
  if(item.id){
    var selectedItem = listManager.isToBeAdded(item.id, null);
    console.log(selectedItem);
    if (selectedItem) {
      // selectedItemId.value = selectedItem.id;
      // newAmount.value = parseInt(selectedItem.itemAmount?.toString() as string);
      // newUnit.value = selectedItem.itemUnit;
      return true;
    } 
  }
  if(item.name){
    var selectedItem = listManager.isToBeAdded(null, item.name);
    console.log(selectedItem);
    if (selectedItem) {
      // selectedItemId.value = selectedItem.id;
      // newAmount.value = parseInt(selectedItem.itemAmount?.toString() as string);
      // newUnit.value = selectedItem.itemUnit;
      return true;
    } 
  }
  return false;
}

async function toBeAdded(item: Item){
  let newitem: InListItem;
  // if (filterItems.value.length === 0) {
  //   filterItems.value = [{id: "", name: filter.value} as Item];
  //   newitem = listManager.addItemToList(null, item.name);
  //   //filterItems.value = itemManager.getAvailableItems(filter.value);
  // }
  // else{
    newitem = listManager.addItemToList(item.id, null);
    filterItems.value = itemManager.getAvailableItems(filter.value);
    selectedItemId.value = newitem.id;
  // }
  console.log(filterItems.value);
  if(newitem.itemId)
    console.log(itemManager.getNameOfitemId(newitem.itemId) + ' kategorie ' + itemManager.getCategoryNameOfItemId(newitem.itemId));
}

function recentlyUsedToBeAdded(item:RecentlyUsedItem) {
  console.log(item);
  listManager.recentlyUsedToBeAdded(item.itemId, item.amount, item.unit);
}

function onInput(event: Event) {
  text = (event.target as HTMLInputElement).value;
  newAmount.value = parseInt(text);
}

watch(newAmount, async () => {
  if (list.value) {
    listManager.setAmountToAdd(selectedItemId.value, newAmount.value, newUnit.value as ItemAmountUnit);
  }
});

function setAmountUnit(option: string): void {
  newUnit.value = option;
  listManager.setAmountToAdd(selectedItemId.value, newAmount.value, (option as ItemAmountUnit));
}

function saveAndClose(){
  listManager.commitAddingItems();
  filter.value = '';
  router.push(`/list/${props.id}`);
}

function close(){
  router.push(`/list/${props.id}`);
}

watch(filter, async () => {
  if (filter.value.length > 0) {
    filterItems.value = itemManager.getAvailableItems(filter.value);
    if (filterItems.value.length === 0) {
      filterItems.value = [{id: "", name: filter.value} as Item];
    }
  } else {
    filterItems.value = [];
  }
});

</script>

<template>
    <h1 class="headermain">
        <h1>Add item</h1>
    </h1>
    <div class="flex flex-col mt-20 px-4 fixed top-0 left-0 right-0">
        <label for="filter" class="block text-sm/6 font-medium text-gray-500 font-normal">Filter</label>
        <div class="mt-2">
            <div class="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div class="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                <input  v-model="filter" type="text" name="filter" id="filter" class="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6" placeholder="" />
            </div>
        </div>
    </div>
    <div class="modal-body">
        <ul class="">
            <div class="clickable" v-for="item in filterItems" :key="item.id">
                <li v-if="!selected(item)" @click="toBeAdded(item)">
                    <div>
                    {{ item.name }}
                    </div>
                </li>
                <li v-else class="checked">
                    <div @click="toBeAdded(item)">
                    {{ item.name }}
                    </div>
                    <div class="mt-2">
                        <div class="flex items-center rounded-md bg-white pl-3outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                        <div class="shrink-0 select-none rounded-md text-base text-gray-500 sm:text-sm/6"></div>
                        <input @input="onInput" type="text" name="filter" id="filter" class="block min-w-0 grow py-1.5 pl-1 pr-3 rounded-md text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6" placeholder="1" />
                        </div>
                    </div> 
                    <!-- <input placeholder="1" @input="onInput" /> -->
                    <AmountUnitDropdown :return-option="setAmountUnit"/>
                </li>
            </div>
        </ul>
        <div v-if="!filter">
            <RecentlyUsedTable :id="props.id" :toBeAdded="recentlyUsedToBeAdded"/>
        </div>
    </div>

    <div class="bottomactionbar">
        <svg class="largeicon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon" @click="close">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
        </svg> 
        
        <svg class="largeicon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon" @click="saveAndClose">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path>
        </svg>
    </div>
    
</template>

<style>

.filter-input{
    display: flex;
    justify-content: center;
    margin-top: 5rem;
}

</style>