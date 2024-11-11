<script setup lang="ts">
import { type InListItem } from 'backend';
import { ref, defineProps } from 'vue';

const props = defineProps<{
    item: InListItem;
    onItemClick(item: any): void;
    checkItem(item: any): void;
}>();

</script>

<template>
    <div class="itemdata" @click="onItemClick(item)">
        <div>{{ item.customItemName }}</div>
        <div class="itemamount">{{ item.itemAmount + " " + item.itemUnit }}</div>
    </div>
    <input type="checkbox" id="checkbox" v-model="item.itemChecked" v-on:click="checkItem(item)"/>
</template>