<script setup lang="ts">
import { ref, inject, onMounted, watch, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { type List, type Item, type InListItem, type ItemAmountUnit } from 'backend';
import type { ListManager } from '@/managers/ListManager';
import type { ItemManager } from '@/managers/ItemManager';
import type { UserManager } from '@/managers/UserManager';
import Dropdown from '@/components/Dropdown.vue';
import AmountUnitDropdown from '@/components/AmountUnitDropdown.vue';
import InputAmount from '@/components/Input.vue';

import ListHeader from '@/components/ListsActionMenu.vue';
import { defineProps } from 'vue';
import ItemRow from '@/components/ItemRow.vue';

const listManager = inject('listManager') as ListManager;
const itemManager = inject('itemManager') as ItemManager;
const userManager = inject('userManager') as UserManager;
const list = reactive(ref<List | null>(null));
const items = ref<InListItem[]>([]);
const router = useRouter();
const editModal = ref(false);
const addItemModal = ref(false);
const editItemModal = ref(false);
const shareListModal = ref(false);
const newUnit = ref('pcs');

const code = ref(0);

var newItem: InListItem = {id: 0, customItemName: "", itemAmount: 0, itemChecked: false, itemId: "", itemUnit: ("" as "g"), itemCheckedByUsername: ""};
const sortOrder = ref('Name');

var newName: string = '';

const props = defineProps<{
    id: string;
}>();

async function saveListTitle(){
    await listManager.setListTitle(props.id, newName);
    list.value = await listManager.getListData(props.id);
    closeModal();
    newName = '';
}

function editListModal() {
    editModal.value = true;
}

function openAddItemModal() {
  router.push(`/additem/${props.id}`);
}

async function deleteList(){
    listManager.removeListLocally(props.id);
    goBack();
}

function goBack() {
    router.push('/');
}

function closeModal() {
    editModal.value = false;
}

// function closeAddItemModal(){
//   listManager.clearItemsToAdd();
//   addItemModal.value = false;
//   filter.value = '';
// }

onMounted(async () => {
  if (listManager) {
    list.value = await listManager.getListData(props.id);
    if(list.value){
      code.value = list.value.code;
    }
  }
});


function checkItem(item: InListItem) {  
  listManager.toggleItemChecked(props.id, item.id);
}

function onItemClick(item: InListItem) {
  newItem = {id: item.id, customItemName: item.customItemName, itemAmount: item.itemAmount, itemChecked: item.itemChecked, itemId: item.itemId, itemUnit: item.itemUnit, itemCheckedByUsername: item.itemCheckedByUsername}; 
  if(item.itemId && !item.customItemName)  
    newItem.customItemName = itemManager.getNameOfitemId(item.itemId);
  editItemModal.value = true;
}

function closeEditItem(){
  editItemModal.value = false;
}

async function saveEditItem(){
  if(list.value){
    listManager.editItem(list.value, newItem.customItemName, newItem.itemAmount, newItem.id, newItem.itemUnit);
  }
  list.value = await listManager.getListData(props.id);
  editItemModal.value = false;
}

function setUnit(option: string){
  newUnit.value = option;
}

const sorted = computed(() => {
  if (sortOrder.value === 'Category') {
    return list.value?.listItems.sort((a, b) => {
      let catA = itemManager.getCategoryNameOfItemId(a.itemId).toUpperCase();
      let catB = itemManager.getCategoryNameOfItemId(b.itemId).toUpperCase();
      return catA < catB ? -1 : 1;
    });
  } else if (sortOrder.value === 'Name') {
    return list.value?.listItems.sort((a, b) => {
      if(!a.itemId || !b.itemId){ //check to silence warning
        return 0;
      }
      let nameA = itemManager.getNameOfitemId(a.itemId).toUpperCase();
      if(nameA == "UNKNOWN ITEM" && a.customItemName){
        nameA = a.customItemName.toUpperCase();
      }
      let nameB = itemManager.getNameOfitemId(b.itemId).toUpperCase();
      if(nameB == "UNKNOWN ITEM" && b.customItemName){
        nameB = b.customItemName.toUpperCase();
      }
      console.log(nameA + " " + nameB);
      return nameA < nameB ? -1 : 1;
    });
  } else {
    return list.value?.listItems;
  }
});

function setSortOption(option: string){
  console.log(option);
  sortOrder.value = option;
}

// watch(newAmount, async () => {
//   if (list.value) {
//     listManager.setAmountToAdd(selectedItemId.value, newAmount.value, newUnit.value as ItemAmountUnit);
//   }
// });

// watch(filter, async () => {
//   if (filter.value.length > 0) {
//     filterItems.value = itemManager.getAvailableItems(filter.value);
//     if (filterItems.value.length === 0) {
//       filterItems.value = [{id: "", name: filter.value} as Item];
//     }
//   } else {
//     filterItems.value = [];
//   }
// });

// const selected = (item: Item): boolean => {
//   return listManager.isToBeAdded(item.name);
// }

// function onInput(event: Event) {
//   text = (event.target as HTMLInputElement).value;
//   newAmount.value = parseInt(text);
// }

const getColor = (item: InListItem) => {
  let cat = itemManager.getCategoryNameOfItemId(item.itemId);
  console.log(cat);
  switch(cat){
    case "Fruits":
      return "bg-fruits";
    case "Vegetables":
      return "bg-vegetables";
    case "Dairy":
      return "bg-dairy";
    case "Meat":
      return "bg-meat";
    case "Bread":
      return "bg-bread";
    case "Sweets":
      return "bg-sweets";
    case "Drinks":
      return "bg-drinks";
    case "Spices":
      return "bg-spices";
    case "Other":
      return "bg-other";
    default:
      return "bg-other";
  }
}

function onShareClick() {
  shareListModal.value = true;
}

function closeShareModal() {
  shareListModal.value = false;
}

async function shareList(){
  if(list.value){
    list.value.code = code.value;
    await listManager.setListData(list.value.id, list.value);
  } 
  shareListModal.value = false;
}

// function setAmountUnit(option: string): void {
//   newUnit.value = option;
//   listManager.setAmountToAdd(selectedItemId.value, newAmount.value, (option as ItemAmountUnit));
// }

async function uncheckAll(){
  if(list.value){
    for (let item of list.value?.listItems){
      item.itemChecked = false;
    }
  }
  await listManager.uncheckAllItems(props.id);
}

</script>

<template>
  <div>
    <ListHeader :list="list" :sort-order="sortOrder" :set-sort-option="setSortOption" :go-back="goBack" :delete-list="deleteList" :on-share-click="onShareClick" :edit-list-modal="editListModal"/>
    <div class="flex flex-col mb-4">
      <ul>
        <p class="mx-2 text-gray-500 mb-2">Not checked items</p>
        <div v-for="item in sorted" :key="item.id">    
            <li class="flex flex-row rounded-lg mx-2 shadow justify-between py-1" :class="`${getColor(item)}`" v-if="!item.itemChecked">
              <ItemRow :item="item" :on-item-click="onItemClick" :check-item="checkItem"/>
            </li>
        </div>
        <div class="flex flex-row justify-between mt-5 mb-2">
          <p class="mx-2 text-gray-500">Checked items</p>
          <p class="mx-2 text-gray-500 cursor-pointer" @click="uncheckAll()">Uncheck all</p>
        </div>
        <div v-for="item in list?.listItems" :key="item.id" >
          <li class="flex flex-row rounded-lg mx-2 shadow py-1 bg-lightgray" v-if="item.itemChecked">
            <ItemRow :item="item" :on-item-click="onItemClick" :check-item="checkItem"/>
          </li>
        </div>
      </ul>
    </div>
    <div class="flex flex-row bg-primary justify-around fixed bottom-0 left-0 right-0">
      <svg class="w-12 h-12 cursor-pointer m-4 text-white" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon" @click="openAddItemModal">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
      </svg>   
    </div>


    <div v-if="editModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" ref="target">
          <div class="modal-head">
            <slot name="header">Edit list</slot>
          </div>
          <div class="modal-body">
            <input placeholder="new name" v-model="newName" />
          </div>
          <div class="modal-footer">
            <slot name="footer">
                <button @click="closeModal()">close</button>
                <button @click="saveListTitle">save</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="editItemModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" ref="target">
          <div class="modal-head">
            <slot name="header">Edit item</slot>
          </div>
          <div class="flex flex-col mx-3 mt-2">
            <label for="name" class="text-gray-500">{{ 'Name' }}</label>
            <div class="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
              <input v-model="newItem.customItemName" class="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6">
            </div>
            <InputAmount :title="'Amount'" v-model:new-amount="newItem.itemAmount" v-model:new-unit="newItem.itemUnit" :selected="newItem.itemUnit"/>
          </div>
          
          <div class="modal-footer">
            <slot name="footer">
              <button @click="closeEditItem()">close</button>
              <button @click="saveEditItem()">save</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="shareListModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" ref="target">
          <div class="modal-head">
            <slot name="header">Import list</slot>
          </div>
          <div class="modal-body">
            <input v-model="code">
          </div>
          <div class="modal-footer">
            <slot name="footer">
                <button @click="closeShareModal()">close</button>
                <button @click="shareList()">share</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<style>

.item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(111, 139, 141, 1);
  background-color: rgba(210, 210, 210, 1);
  color: black;
  cursor: pointer;
}

.itemdata{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
}

.checkeditem{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(111, 139, 141, 1);
  background-color: rgba(237, 237, 237, 1);
  color: black;
  cursor: pointer;
}

.buttonplus {
    border: none;
    margin: 0 0.5rem;
    cursor: pointer;
    font-size: 2rem;
    background-color: rgba(111, 139, 141, 1); 
    color: white;
    flex: 1;
    /* 
  padding: 1rem;
  margin: 0; 
   width: 15rem;
  position: fixed;
  bottom: 0rem;  */
}

.actionmenu {
  display: flex;
  font-size: 2rem;
  background-color: rgba(111, 139, 141, 1);
  color: white;
  /* padding: 1rem;
  margin: 0; */
  border: none;
  cursor: pointer;
  width: 15rem;
  position: fixed;
  bottom: 0rem;
}

.padtop {
  padding-top: 50px;
}

a {
  text-decoration: none;
  color: black;
}

.container {
  width:  15rem;
}
.modal-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.modal-container { 
  width: 90%;
  max-width: 400px;
  max-height: 400px;
  margin: 170px auto;
  /* padding: 20px 20px; */
  background-color: #fff;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-head{
  font-size: 1.7rem;
  background-color: rgba(111, 139, 141, 1);
  color: white;
  margin: 0;
  position: top;
  text-align: center;
}

.modal-body{
  flex-direction: column;
  padding-top: 0;
  margin: 0;
  margin-top: 9rem;
  padding: 20px 20px;
  display: flex;
  max-height: calc(80vh - 150px);
  overflow-y: auto;

}

.modal-body ul {
  padding: 0;
  margin: 0;
  list-style: none; 
}

.modal-footer{
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background-color: white;
} 

.modal-input {
  padding: 10 20px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  /* width: 100%; */
  box-sizing: border-box;
}

.modalmenu{
  display: flex;
  justify-content: space-around;
}

.filter-input{
  padding: 20px 20px;
  z-index: 10;
}

.content{
  max-height: calc(80vh - 150px);
  overflow-y: auto;
  padding: 20px 20px;
}

.icon{
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}
.smallicon{
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.editmenu{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  padding: 0 20px;
  background-color:rgba(186, 211, 212, 1);
  color: black;
  padding: 0.5rem;
  margin-top: 9rem;
  position: fixed;
  align-items: center;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 1000;
}
.top{
  font-size: 2rem;
  background-color: rgba(111, 139, 141, 1);
  color: white;
  margin-bottom: 30px;
  position: fixed;
}

.clickable{
  cursor: pointer;
}

.checked{
  cursor: pointer;
  background-color: rgba(237, 237, 237, 1);
}

.amount{
  width: 4rem;
}
.itemamount{
  font-size: 0.85rem;
}

.sort{
  display: flex;
  justify-content: center;
  align-items: start;
  vertical-align: middle;
  gap: 0.4rem;
  border: none;
  background-color: rgba(186, 211, 212, 1);
}
.topicons{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  border: none;
  background-color: rgba(186, 211, 212, 1);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>