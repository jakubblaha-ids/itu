<script setup lang="ts">

import { ref, inject, onMounted } from 'vue';
import { type RecentlyUsedItem } from 'backend';
import { type List } from 'backend';
import { type Item } from 'backend';
import { defineProps } from 'vue';
import { type ItemManager } from '@/managers/ItemManager';

const itemManager = inject('itemManager') as ItemManager;

const name = ref('')

const props = defineProps<{
    item: RecentlyUsedItem;
}>()

onMounted(async () => {
    name.value = itemManager.getNameOfitemId(props.item.itemId);
    if(name.value == "Unknown item"){
        if(props.item.itemId)
            name.value = props.item.itemId;
    }
});

</script>

<template>
    <div class="flex flex-row justify-between gap-2 px-6 py-4 bg-gray-200 rounded-lg shadow transition hover:cursor-pointer hover:opacity-70">
        <div>{{ name }} </div>
        <div class="text-gray-500">{{ item.amount + " " + item.unit }} </div>
    </div>
</template>