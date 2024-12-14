<script setup lang="ts">
import Dropdown from '@/components/Dropdown.vue';
import { type List } from 'backend';
import { ref, onMounted } from 'vue';

const editTitle = ref(false);
const title = ref('');

const props = defineProps<{
    list: List | null;
    sortOrder: string;
    setSortOption(option: string): void;
    goBack(): void;
    deleteList(): void;
    onShareClick(): void;
    editListModal(): void;
    openSortOptions():void;
}>()

onMounted(() => {
    if(props.list?.listTitle)
        title.value = props.list.listTitle;
});

</script>

<template>
    <div class="bg-primary flex flex-row items-center justify-between shadow p-1 gap-2">
        <svg class="w-8 h-8 cursor-pointer m-3" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="goBack">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
        </svg>
        <div class="flex-grow flex justify-center px-2">
            <h1 class="cursor-pointer" @click="props.editListModal">
                {{ list?.listTitle }}
            </h1>
        </div>
        <svg class="w-8 h-8 cursor-pointer m-3" data-slot="icon" fill="none" stroke-width="1.0" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="deleteList">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
        </svg>
    </div>

    <div class="flex flex-row justify-between bg-secondary shadow py-2 rounded-b mt-1">
        <div class="flex flex-row justify-between gap-x-3 ml-4 px-2">
            <p>Sort by:</p>
            <Dropdown :title="sortOrder" :return-option="setSortOption" class="font-light w-auto"/>
        </div>
        <div class="flex flex-row ">
            <p class="pr-1 font-light" v-if="sortOrder == 'Category'">{{  }}</p>
            <svg  v-if="sortOrder == 'Category'" @click="openSortOptions()" class="mt-1 w-4 h-4 cursor-pointer" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"></path>
            </svg>
            <div class="flex flex-row mt-1 gap-x-6 mx-4 px-2">
                <svg class="w-4 h-4 cursor-pointer" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="onShareClick">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"></path>
                </svg>
                <!-- <svg class="w-4 h-4 cursor-pointer" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" @click="editListModal">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"></path>
                </svg> -->
            </div>
        </div>
    </div>
    

</template>

<style>
.sort-options{
    width: 1rem;
    height: 1rem;
    cursor: pointer;    
    padding-top: 0.1rem;
}
</style>