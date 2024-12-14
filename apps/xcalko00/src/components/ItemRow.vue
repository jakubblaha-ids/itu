<script setup lang="ts">
import { type InListItem } from 'backend';
import { ref, onMounted, inject } from 'vue';
import { type ItemManager } from '@/managers/ItemManager';
import type { UserManager } from '@/managers/UserManager';

const itemManager = inject('itemManager') as ItemManager;
const userManager = inject('userManager') as UserManager;

const name = ref('')
const checkedByUser = ref(userManager.getUsername());
const category = ref('')

const props = defineProps<{
    item: InListItem;
    onItemClick(item: any): void;
    checkItem(item: any): void;
}>();

onMounted(() => {
    checkedByUser.value = props.item.itemCheckedByUsername;
    if (props.item.itemId){
        name.value = itemManager.getNameOfitemId(props.item.itemId);
        if(name.value == "Unknown item"){
            if(props.item.customItemName)
                name.value = props.item.customItemName;
        }
        category.value = itemManager.getCategoryNameOfItemId(props.item.itemId);
    }
    else{
        name.value = props.item.customItemName!;
    }
});

const check = (item: InListItem) => {
    checkedByUser.value = userManager.getUsername();
    props.checkItem(item);
}

</script>

<template>
    <div class="flex flex-col" @click="onItemClick(item)">
        <div class="text-xs">{{ name }}</div>
    </div>
    <div class="flex flex-row grid-cols-2 gap-4">
        <div class="shadow bg-mypink bg-opacity-30 rounded-2xl .gap-20 justify-start" v-if="item.itemChecked">
            <div class="px-2 text-amount" >{{ checkedByUser }}</div>
        </div>
        <div class="flex flex-row gap-3 justify-around">
            <div class="text-amount">{{ item.itemAmount + " " + item.itemUnit }}</div>
            <input class="mt-1" type="checkbox" id="checkbox" v-model="item.itemChecked" v-on:click="check(item)"/>
        </div>
    </div>
</template>