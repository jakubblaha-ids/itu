<script setup lang="ts">
import { ref, inject, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { type List, type Item, type InListItem, type ItemAmountUnit, type RecentlyUsedItem } from 'backend';
import type { ListManager } from '@/managers/ListManager';
import type { ItemManager } from '@/managers/ItemManager';
import RecentlyUsedTable from '@/components/RecentlyUsedTable.vue';
import Modal from '@/components/Modal.vue';

const listManager = inject('listManager') as ListManager;
const itemManager = inject('itemManager') as ItemManager;

const router = useRouter();

const list = reactive(ref<List | null>(null));
const filter = ref('');
const filterItems = ref<Item[]>([]);
const selectedItemId = ref(0);
const newAmount = ref(0); 
const newUnit = ref('pcs'); 
const ok = ref('');
const openAddOptions = ref(false);
const name = ref('')
const itemToBeAdded = ref<Item>();
const show = ref('recently');
const all = ref<Item[]>([]);

const props = defineProps<{
    id: string;
}>();

onMounted(async () => {
  if (listManager) {
    list.value = await listManager.getListData(props.id);
    listManager.selectedListData = list.value;
    listManager.selectedListId = props.id;
  }
  if(itemManager){
    all.value = itemManager.availableItems;
  }
});

const selected = (item: Item): boolean => {
  if(item.id){
    var selectedItem = listManager.isToBeAdded(item.id, null);
    if (selectedItem) {
      return true;
    } 
  }
  if(item.name){
    var selectedItem = listManager.isToBeAdded(null, item.name);
    if (selectedItem) {
      return true;
    } 
  }
  return false;
}

async function toBeAdded(item: Item){
  let newitem: InListItem;
  if (item.id == "") {
    newitem = listManager.addItemToList(null, item.name);
    selectedItemId.value = newitem.id;
    ok.value = item.id;
    name.value = item.name;
    itemToBeAdded.value = item;
    openAddOptions.value = true;
    return; 
  }
  // else{
    newitem = listManager.addItemToList(item.id, null);
    filterItems.value = itemManager.getAvailableItems(filter.value);
    selectedItemId.value = newitem.id;
  // }
  if(newitem.itemId)
    console.log(itemManager.getNameOfitemId(newitem.itemId) + ' kategorie ' + itemManager.getCategoryNameOfItemId(newitem.itemId));

  ok.value = item.id;
  name.value = item.name;
  itemToBeAdded.value = item;
  openAddOptions.value = true;
}

const closeAddOptions = (unit: string, amount: number):void =>{
  newUnit.value = unit;
  newAmount.value = amount;
  if (list.value) {
    listManager.setAmountToAdd(selectedItemId.value, newAmount.value, newUnit.value as ItemAmountUnit);
  }
  openAddOptions.value = false;
}

function recentlyUsedToBeAdded(item:RecentlyUsedItem) {
  console.log(item);
  listManager.recentlyUsedToBeAdded(item.itemId, item.amount, item.unit);
}

watch(newAmount, async () => {
  if (list.value) {
    listManager.setAmountToAdd(selectedItemId.value, newAmount.value, newUnit.value as ItemAmountUnit);
  }
});

function saveAndClose(){
  listManager.commitAddingItems();
  filter.value = '';
  router.push(`/list/${props.id}`);
}

function clicked(item: Item){
  return ok.value == item.id;
}

async function remove(item: Item){
  openAddOptions.value = false;
  for(const itemtoadd of list.value!.listItems){
      if(itemtoadd.itemId){
        if(itemtoadd.itemId === item.id){
          await listManager.deleteItemFromList(list.value!.id, itemtoadd.id);
          list.value = await listManager.getListData(list.value!.id);
          filterItems.value = itemManager.getAvailableItems(filter.value); 
          return;
        }
      }
      else{
        if(itemtoadd.customItemName === item.name){
          await listManager.deleteItemFromList(list.value!.id, itemtoadd.id);
          list.value = await listManager.getListData(list.value!.id);
          filterItems.value = itemManager.getAvailableItems(filter.value)
          return;
        }
      }
    }
  for(const itemtoadd of listManager.itemsToAdd){
    if(itemtoadd.itemId){
      if(itemtoadd.itemId === item.id){
        listManager.removeItemToAdd(itemtoadd.id);
        filterItems.value = itemManager.getAvailableItems(filter.value); 
        return;
      }
    }
    else{
      if(itemtoadd.customItemName === item.name){
        listManager.removeItemToAdd(itemtoadd.id);
        filterItems.value = itemManager.getAvailableItems(filter.value); 
        filter.value = filter.value;
        return;
      }
    }
  }
  ok.value = '';
}

function close(){
  for(const itemtoadd of listManager.itemsToAdd)
    listManager.removeItemToAdd(itemtoadd.id);
  ok.value = '';
  router.push(`/list/${props.id}`);
}

watch(filter, async () => {
  if (filter.value.length > 0) {
    show.value = ''
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
    <Modal class="" v-if="openAddOptions" :amount="newAmount" :name="name" :item="itemToBeAdded" :cancel="remove" :close="closeAddOptions" :edit="false" :edit-and-close="(amount: number, unit: string, id: number) => {}" :unit="newUnit"/>
    <h1 class="headermain">
        <p>Add item</p>
    </h1>
    <div class="flex flex-col mt-20 px-4 fixed top-0 left-0 right-0">
        
        <div class="mt-1">
            <div class="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div class="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                <input  v-model="filter" type="text" name="filter" id="filter" class="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6" placeholder="Apples" />
                <svg class="h-4 w-4 mt-0.5 mr-4 cursor-pointer" @click="filter = ''" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                </svg>
            </div>
        </div>
        <ul class="flex flex-row mt-2 gap-6 mb-0 pb-0 z-500">
          <b-link class="" :class="`${(show == 'recently') ? '' : 'text-gray'}`" href="#" @click="() => {show = 'recently'; filter = ''}">Recently used items</b-link>
          <b-link class="" :class="`${(show == 'all') ? '' : 'text-gray'}`" href="#" @click="() => {show = 'all'; filter = ''}">All items</b-link>
        </ul>
    </div>
    <div class="modal-body">
        <ul v-if="show == 'all'" class="">
          <div class="grid grid-cols-2 gap-1" >
            <div v-for="item in all" :key="item.id">
                <li v-if="!selected(item)" class="py-1 rounded-md" @click="toBeAdded(item)">
                    <div>
                    {{ item.name }}
                    </div>
                </li>
                <li v-else-if="clicked(item)" class="bg-lightgray py-0.5 border-solid border-2 rounded-md">
                  <div class="fles flex-col">
                    <div @click="">
                    {{ item.name }}
                    </div> 
                  </div>
                    <svg class="h-4 w-4 mt-0.5" @click="remove(item)" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </li>
                <li v-else class="bg-lightgray py-0.5 rounded-md">
                  <div class="fles flex-col">
                    <div @click="">
                    {{ item.name }}
                    </div> 
                  </div>
                    <svg class="h-4 w-4 mt-0.5" @click="remove(item)" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </li>
            </div>
          </div>
        </ul>
        
        <div v-else-if="show == 'recently'">
            <RecentlyUsedTable :id="props.id" :toBeAdded="recentlyUsedToBeAdded"/>
        </div>

        <ul v-else class="">
            <div class="cursor-pointer hover:opacity-80" v-for="item in filterItems" :key="item.id">
                <li v-if="!selected(item)" class="py-1" @click="toBeAdded(item)">
                    <div>
                    {{ item.name }}
                    </div>
                </li>
                <li v-else-if="clicked(item)" class="bg-lightgray py-0.5 border-solid border-2">
                  <div class="fles flex-col">
                    <div @click="">
                    {{ item.name }}
                    </div> 
                  </div>
                    <svg class="h-4 w-4 mt-0.5" @click="remove(item)" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </li>
                <li v-else class="bg-lightgray py-0.5">
                  <div class="fles flex-col">
                    <div @click="">
                    {{ item.name }}
                    </div> 
                  </div>
                    <svg class="h-4 w-4 mt-0.5" @click="remove(item)" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </li>
            </div>
        </ul>

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