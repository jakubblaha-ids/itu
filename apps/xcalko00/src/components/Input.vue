<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
    title: string;
    newUnit: string;
    newAmount: string | number;
}>();

const emit = defineEmits<{
    (event: 'update:newAmount', newValue: string | number): void;
    (event: 'update:newUnit', unit: string): void;
}>();

function onAmountChange(newValue: string | number) {
    if(!newValue){
        newValue = 1;
    }
    emit('update:newAmount', newValue);
}

function onUnitChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
  const newUnit = selectElement.value;
  emit('update:newUnit', newUnit);
}

</script>

<template>
    <div>
        <label for="price" class="text-gray-500">{{ title }}</label>
        <div class="amount-input">
        <input
            type="text"
            name="price"
            id="price"
            class="modal-input"
            placeholder="1"
            :value="props.newAmount"
            @input="onAmountChange($event.target.value)"
        />
        <div class="absolute inset-y-0 right-0 flex items-center">
            <select
            id="amount"
            name="amount"
            class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            @change="onUnitChange"
            >
            <option value="pcs">pcs</option>
            <option value="ml">ml</option>
            <option value="g">g</option>
            <option value="custom">custom</option>
            </select>
        </div>
        </div>
    </div>
</template>
  

<style>
.amount-input{
    display: flex;
}

.text-gray-500{
    color: #6b7280;
}
</style>