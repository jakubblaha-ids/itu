<script setup lang="ts">

import { ref, inject, onMounted } from 'vue';
import { type RecentlyUsedItem } from 'backend';
import { type ItemManager } from '@/managers/ItemManager';
import { type ListManager } from '@/managers/ListManager';

const itemManager = inject('itemManager') as ItemManager;
const listManager = inject('listManager') as ListManager;

const name = ref('')

const props = defineProps<{
    item: RecentlyUsedItem;
}>()

onMounted(async () => {
    name.value = itemManager.getNameOfitemId(props.item.itemId);
    if(name.value == "Unknown item" || name.value == ""){
        if(props.item.itemId)
            name.value = props.item.itemId;
    }
});

const selected = (): Boolean => {
    if(props.item.itemId){
    var selectedItem = listManager.isToBeAdded(props.item.itemId, null);
    console.log(selectedItem);
    if (selectedItem) {
      // selectedItemId.value = selectedItem.id;
      // newAmount.value = parseInt(selectedItem.itemAmount?.toString() as string);
      // newUnit.value = selectedItem.itemUnit;
      return true;
    } 
  }
//   if(item.name){
//     var selectedItem = listManager.isToBeAdded(null, props.item.);
//     console.log(selectedItem);
//     if (selectedItem) {
//       // selectedItemId.value = selectedItem.id;
//       // newAmount.value = parseInt(selectedItem.itemAmount?.toString() as string);
//       // newUnit.value = selectedItem.itemUnit;
//       return true;
//     } 
//   }
  return false;
}

</script>

<template>
    <div class="flex flex-row justify-between gap-2 px-6 py-1 rounded-lg shadow transition hover:cursor-pointer hover:opacity-70" :class="`${selected() ? 'bg-lightgray' : 'bg-gray'}`">
        <div>{{ name }} </div>
        <div class="text-gray-500">{{ item.amount + " " + item.unit }} </div>
    </div>
</template>