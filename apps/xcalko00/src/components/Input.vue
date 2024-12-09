<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import AmountUnitDropdown from '@/components/AmountUnitDropdown.vue';

const props = defineProps<{
    title: string;
    newUnit: string;
    newAmount: string | number;
    selected: string;
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
    <div class="flex flex-col">
        <label for="price" class="text-gray-500">{{ title }}</label>
        <div class="flex flex-row">
            <div class="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <input
                    type="text"
                    name="price"
                    id="price"
                    class="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                    placeholder="1"
                    :value="props.newAmount"
                    @input="onAmountChange($event.target.value)"
                />
            </div>
            <form class="w-auto">
                <select id="countries" class=" h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" @change="onUnitChange">
                    <option selected>{{ props.selected }}</option>
                    <option value="ml">ml</option>
                    <option value="g">g</option>
                    <option value="pcs">pcs</option>
                    <option value="c">custom</option>
                </select>
            </form>
                <!-- <div>
                    <select
                    id="amount"
                    name="amount"
                    class="h-full rounded-md border-0 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm py-0 pl-2 pr-7 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    @change="onUnitChange"
                    >
                    <option value="pcs">pcs</option>
                    <option value="ml">ml</option>
                    <option value="g">g</option>
                    <option value="custom">custom</option>
                    </select>
                </div> -->
           
        <!-- <AmountUnitDropdown :return-option="onAmountChange"/> -->
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