<script setup lang="ts">
import { ref, inject, onMounted, watch, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { type List, type Item, type InListItem, type ItemAmountUnit } from 'backend';
import type { ListManager } from '@/managers/ListManager';
import type { ItemManager } from '@/managers/ItemManager';
import { VueDraggableNext } from 'vue-draggable-next';
import ListHeader from '@/components/ListsActionMenu.vue';
import ItemRow from '@/components/ItemRow.vue';
import EditItem from '@/components/EditItem.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import ShareModal from '@/components/ShareModal.vue';
import { userManager } from '@/managers/list';

const listManager = inject('listManager') as ListManager;
const itemManager = inject('itemManager') as ItemManager;
const list = reactive(ref<List | null>(null));
const router = useRouter();
const editModal = ref(false);
const editItemModal = ref(false);
const shareListModal = ref(false);
const isDrawerOpen = ref(false);
const categories = ref(['']);

const code = ref(0);

var newItem: InListItem = {id: 0, customItemName: "", itemAmount: 0, itemChecked: false, itemId: "", itemUnit: ("" as "g"), itemCheckedByUsername: ""};
const sortOrder = ref('Name');
const newName = ref('')

const props = defineProps<{
    id: string;
}>();

async function saveListTitle(){
  if(list.value?.listTitle)
    list.value.listTitle = newName.value;
    editModal.value = false;
  await listManager.setListTitle(props.id, newName.value);
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

onMounted(async () => {
  if (listManager) {
    list.value = await listManager.getListData(props.id);
    if(list.value){
      code.value = list.value.code;
    }
  }
  categories.value = listManager.getCategories(list.value!);
});


function checkItem(item: InListItem) { 
  item.itemCheckedByUsername = userManager.getUsername(); 
  listManager.toggleItemChecked(props.id, item.id);
}

function onItemClick(item: InListItem) {
  newItem = {id: item.id, customItemName: item.customItemName, itemAmount: item.itemAmount, itemChecked: item.itemChecked, itemId: item.itemId, itemUnit: item.itemUnit, itemCheckedByUsername: item.itemCheckedByUsername}; 
  if(item.itemId && !item.customItemName)  
    newItem.customItemName = itemManager.getNameOfitemId(item.itemId);
  editItemModal.value = true;
}

async function saveEditItem(unit: string, amount:number){
  if(list.value){
    listManager.editItem(list.value, newItem.customItemName, amount, newItem.id, unit as ItemAmountUnit);
  }
  list.value = await listManager.getListData(props.id);
  editItemModal.value = false;
}

const sorted = computed(() => {
  if (sortOrder.value === 'Category') {
    return list.value?.listItems.sort((a, b) => {
      let catA = itemManager.getCategoryNameOfItemId(a.itemId);
      let catB = itemManager.getCategoryNameOfItemId(b.itemId);

      let indexA = categories.value.indexOf(catA);
      let indexB = categories.value.indexOf(catB);

      if (indexA === -1) indexA = Infinity;
      if (indexB === -1) indexB = Infinity;

      return indexA < indexB ? -1 : 1;
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
      return nameA < nameB ? -1 : 1;
    });
  } else {
    return list.value?.listItems;
  }
});

function setSortOption(option: string){
  sortOrder.value = option;
}


const getColor = (item: InListItem) => {
  let cat = itemManager.getCategoryNameOfItemId(item.itemId);
  console.log(cat);
  switch(cat){
    // case "Fruits":
    //   return "bg-fruits";
    // case "Vegetables":
    //   return "bg-vegetables";
    // case "Dairy":
    //   return "bg-dairy";
    // case "Meat":
    //   return "bg-meat";
    // case "Bread":
    //   return "bg-bread";
    // case "Sweets":
    //   return "bg-sweets";
    // case "Drinks":
    //   return "bg-drinks";
    // case "Spices":
    //   return "bg-spices";
    // case "Other":
    //   return "bg-other";
    // case "Grains":
    //   return "bg-grains";
    default:
      return "bg-other";
  }
}

async function uncheckAll(){
  if(list.value){
    for (let item of list.value?.listItems){
      item.itemChecked = false;
    }
  }
  await listManager.uncheckAllItems(props.id);
}

async function deleteItem(){
  await listManager.deleteItemFromList(props.id, newItem.id);
  list.value = await listManager.getListData(props.id);
  editItemModal.value = false;
}

</script>

<template>
  <div :class="`${(isDrawerOpen || editItemModal || editModal || shareListModal) ? 'opacity-10 bg-lightgray' : ''}`">
    <ListHeader :list="list" :sort-order="sortOrder" :set-sort-option="setSortOption" :go-back="goBack" :delete-list="deleteList" :on-share-click="() => {shareListModal = true;}" :edit-list-modal="() => {editModal = true}" :open-sort-options="() => {isDrawerOpen = true}"/>
    <div v-if="sorted?.length == 0" class="flex items-center justify-center mt-32 text-gray-500">
      <p>No items in list yet</p>
    </div>
    <div v-else class="flex flex-col mb-4">
      <ul>
        <p class="mx-2 text-gray-500 mb-2">Not checked items</p>
        <div v-for="item in sorted" :key="item.id">    
            <li class="flex flex-row rounded-lg mx-2 shadow justify-between py-1" :class="`${getColor(item)}`" v-if="!item.itemChecked">
              <ItemRow :item="item" :on-item-click="onItemClick" :check-item="checkItem"/>
            </li>
        </div>
        <div class="flex flex-row justify-between mt-2 mb-2">
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
    <div class="flex justify-center">
      <div class="flex flex-row shadow-lg bg-primary justify-center fixed bottom-0 rounded-full mb-3">
        <svg class="w-8 h-8 cursor-pointer m-2 text-white" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon" @click="openAddItemModal">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
        </svg>   
      </div>
    </div>
    
    <div v-if="editModal" >
      <ModalWindow :open="editModal" :title="'Edit list'" v-on:close="editModal = false">
        <input placeholder="new name" v-model="newName" /> 

        <template #buttons>
          <button class="mt-3 inline-flex w-full justify-center rounded-md bg-white mx-4 px-3 py-2 text-xs font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 sm:mt-0 sm:w-auto"  @click="() => {editModal = false}">Close</button>
          <button class="mt-3 inline-flex w-full justify-center rounded-md bg-primary mx-4 px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 sm:mt-0 sm:w-auto"  @click="saveListTitle">Save</button> 
        </template>
      </ModalWindow>
    </div>
    <div v-if="editItemModal" >
      <EditItem :name="newItem.customItemName" :amount="newItem.itemAmount" :unit="newItem.itemUnit" :close="saveEditItem" :cancel="() => {editItemModal = false}" :delete="deleteItem" />
    </div>
    
    <div v-if="shareListModal" >
      <ShareModal :open="true" :title="'Share list'" :readonly="true" @close="shareListModal = false" :code="list!.code" />
    </div>
  </div>
  <div v-if="isDrawerOpen" class="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex justify-end">
      <div class="bg-white w-80 h-full p-4 shadow-lg flex flex-col">
        <h2 class="text-lg mb-4 ml-4 mt-2 text-sm">Sort categories</h2>

        <div class="flex-grow flex items-center justify-center">
          <VueDraggableNext v-model="categories" class="dragArea list-group w-full" :list="categories" @change="">
            <div
              class="flex justify-start list-group-item bg-lightgray m-1 py-1 px-3 rounded-md text-center"
              v-for="element in categories"
              :key="element.toString">
              <p class="">{{ element }}</p>
            </div>
          </VueDraggableNext>
        </div>

        <div class="bg-gray-50 px-auto py-3 sm:flex sm:flex-row-reverse sm:px-6 flex flex-row gap-1 justify-center">
          <button 
            type="button" 
            class="mt-3 inline-flex w-full justify-center rounded-md bg-primary mx-4 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 sm:mt-0 sm:w-auto"
            @click="isDrawerOpen = false" 
            ref="cancelButtonRef">
            OK
          </button>
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
  margin-top: 10rem;
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