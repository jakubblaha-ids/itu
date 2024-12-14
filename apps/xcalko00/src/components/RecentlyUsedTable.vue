<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { type RecentlyUsedItem } from 'backend';
import { ItemManager } from '@/managers/ItemManager';
import RecentlyAdded from '@/components/RecentlyAdded.vue';

const itemManager = inject('itemManager') as ItemManager;

const recentlyUsedItems = ref<RecentlyUsedItem[]>([]);

const props = defineProps<{
    id: string;
    toBeAdded(item: RecentlyUsedItem): void;
}>()

onMounted(async () => {
    recentlyUsedItems.value = itemManager.getRecentlyUsedItemsAsItems();
});

</script>


<template>
    <!-- <p class="text-gray-500">Recently used items</p> -->
    <div class="grid grid-cols-2 gap-1 hover:cursor-pointer">
        <template v-for="item in recentlyUsedItems" :key="item.itemId">
                <RecentlyAdded :item="item" @click="props.toBeAdded(item)"/>
        </template> 
    </div>
</template>

<style>
</style>