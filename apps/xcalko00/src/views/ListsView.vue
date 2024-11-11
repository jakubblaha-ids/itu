<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { type List } from 'backend';
import type { ListManager } from '@/managers/ListManager';
import type { UserManager } from '@/managers/UserManager';
// import { itemManager, listManager } from '@/managers/list';
import Layout from '../components/Layout.vue';

const listManager = inject('listManager') as ListManager;
const userManager = inject('userManager') as UserManager;
const lists = ref<List[]>([]);

const importModal = ref(false);
const userModal = ref(false);
const code = ref(0);
const userName = ref(userManager.getUsername());

const router = useRouter();

async function loadLists() {
  if (listManager) {
    await listManager.refreshAvailableLists(); 
    lists.value = listManager.availableLists;  
  }
}

onMounted(async () => {
  loadLists();
});

async function addNewList(){
  if (listManager) {
    await listManager.createList(); 
    loadLists()   
  } 
}

function onClickList(listId: string) {
  router.push(`/list/${listId}`);
}

function toggleModalV(){
  userModal.value = !userModal.value;
}

function importListModal(){
  importModal.value = true;
}

function closeShareModal(){
  importModal.value = false;
}

async function importListCode(){
  await listManager.importList(code.value);
  loadLists();
  closeShareModal();
  router.push(`/list/${listManager.getIdOfImportedList()}`);
}

function onInput(event: Event){
  const target = event.target as HTMLInputElement;
  code.value = parseInt(target.value);
  loadLists();
}

function saveUserName(){
  userManager.setUsername(userName.value);
  toggleModalV();
}

</script>

<template>
    <h1 class="headermain">
      <svg class="icon" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="importListModal">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"></path>
      </svg>
      <h1>Shopli</h1>
      <svg class="icon" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="toggleModalV">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path>
      </svg>
    </h1>
    
    <ul>
      <li v-for="list in lists" :key="list.id">
        <div class="listinfo">
          <span class="text">{{ list.listTitle }} </span>
          <span class="itemsleft"> items left </span>
        </div>
         <svg class="icon" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click=onClickList(list.id)>
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
        </svg>
      </li>
    </ul>
    <span class="bottomactionbar">
      <button class="bottombutton" @click="addNewList">+</button>
    </span>

  <div v-if="importModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" ref="target">
          <div class="modal-head">
            <slot name="header">Share list</slot>
          </div>
          <div class="modal-body">
            <input placeholder="insert code" @input="onInput">
          </div>
          
          <div class="modal-footer">
            <slot name="footer">
              <div class="modalmenu">
                <button @click="closeShareModal()">close</button>
                <button @click="importListCode()">import</button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div> 

    <div v-if="userModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" ref="target">
          <div class="modal-head">
            <slot name="header">User</slot>
          </div>
          <div class="modal-body">
            <input v-model="userName">
          </div>
          
          <div class="modal-footer">
            <slot name="footer">
              <div class="modalmenu">
                <button @click="toggleModalV()">close</button>
                <button @click="saveUserName()">save</button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div> 
</template>

<style>

.headermain {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
}

li .text{
  font-size: 1.2rem;
  
}

li .itemsleft{
  font-size: 0.9rem;
  margin-top: 0.2rem;
  display: block;
}


.bottomactionbar {
  background-color: rgba(111, 139, 141, 1);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.bottomactionbar .bottombutton {
  background-color: rgba(111, 139, 141, 1);
  color: white; 
  font-size: 3rem;
  font-weight: lighter;
  border: none;
  cursor: pointer;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>