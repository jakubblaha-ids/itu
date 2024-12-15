<!-- Autor: Veronika Calkovska (xcalko00) -->

<script setup lang="ts">
import { ref, inject, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { type List } from 'backend';
import type { ListManager } from '@/managers/ListManager';
import type { UserManager } from '@/managers/UserManager';
import CodeModal from '@/components/CodeModal.vue';
import UserEdit from '@/components/UserEdit.vue';

const listManager = inject('listManager') as ListManager;
const userManager = inject('userManager') as UserManager;
const lists = ref<List[]>([]);

const importModal = ref(false);
const userModal = ref(false);
const userName = ref(userManager.getUsername());

const router = useRouter();

async function loadLists(){
  if (listManager) {
    await listManager.refreshAvailableLists(); 
    lists.value = listManager.availableLists;  
    listManager.computeAmount();
  }
}

onMounted(async () => {
  loadLists();
});

async function addNewList(){
  if (listManager) {
    await listManager.createList();
    loadLists();   
  } 
}

function onClickList(listId: string) {
  router.push(`/list/${listId}`);
}

function toggleModalV(){
  userModal.value = !userModal.value;
}

async function importListCode(code: number){
  await listManager.importList(code);
  loadLists();
  // closeShareModal();
  router.push(`/list/${listManager.getIdOfImportedList()}`);
}

function saveUserName(name:string){
  userManager.setUsername(name);
  toggleModalV();
}
async function duplicateList(listId: string){
  var toBeDuplicated = await listManager.getListData(listId)
  if(toBeDuplicated)
    listManager.duplicateList(toBeDuplicated);
  loadLists();
}
</script>

<template>
  <div :class="`${(importModal || userModal)? 'opacity-10' : ''}`">
    <h1 class="flex flex-row bg-primary p-2 shadow justify-between">
      <svg class="w-8 h-8 cursor-pointer m-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="importModal = true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"></path>
      </svg>
      <p>Shopli</p>
      <svg class="w-8 h-8 cursor-pointer m-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="toggleModalV">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path>
      </svg>
    </h1>

    <div v-if="lists.length == 0" class="flex items-center justify-center mt-32 text-gray-500">
      <p>No lists yet</p>
    </div>
    
    <ul class="mt-8">
      <li class="flex flex-row rounded-lg mx-2 shadow" v-for="list in lists" :key="list.id">
        <div class="flex grow my-0" @click=onClickList(list.id)>
          <span class="flex flex-col text-xs gap-1">
            <p class="text-xs"> {{ list.listTitle }} </p>
            <svg fill="none" class="w-4 h-4" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon" @click="duplicateList(list.id)">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"></path>
            </svg>
          </span>
        </div>
        <span class="shadow text-[13px] bg-mypink bg-opacity-30 rounded-2xl .gap-20 justify-start px-2"> {{ listManager.listsWithAmountOfUncheckedItems[list.id]}} item{{ listManager.listsWithAmountOfUncheckedItems[list.id] == 1 ? '': 's'}} left </span>
        <svg class="icon" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click=onClickList(list.id)>
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
        </svg>
      </li>
    </ul>
    <div class="flex justify-center">
      <div class="flex flex-row shadow-lg bg-primary justify-center fixed bottom-0 rounded-full mb-3">
        <svg class="w-8 h-8 cursor-pointer m-2 text-white" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon" @click="addNewList">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
        </svg>   
      </div>
    </div>
  </div>

  
  <CodeModal :open="importModal" :title="'Import list'" @close="importModal = false" @submit="(code) => {importListCode(code)}" :readonly="false" :code="null"/>

  <UserEdit :open="userModal" :title="'User'" :name="userName" v-on:close="userModal = false" v-on:submit="(name) => {saveUserName(name)}"/>
</template>

<style>
.largeicon {
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  color: white;
}

.headermain {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 20px;
  background-color: rgba(111, 139, 141, 1);
  color: white;
  padding: 0.5rem;
  margin: 0;
  position: fixed;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
}

h1{
  font-size: 30px;
  font-weight: normal;
  text-align: center;
  padding-top: 0.47rem;
  flex-grow: 1;
}

ul {
  margin-top: 2rem;
  list-style-type: none;
  max-width: 100%;
  width: 100%;
  margin: 4rem auto;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(210, 210, 210, 1);
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: black;
}

li .listinfo{
  display: flex;
  flex-direction: column; 
  flex-grow: 1;
  margin: 1
}

li .text{
  font-size: 1.2rem;
  
}


.bottomactionbar {
  background-color: rgba(111, 139, 141, 1);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  padding: 2px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 5;
}

</style>