<!-- Autor: Veronika Calkovska (xcalko00) -->

<script setup lang="ts">
import { ref } from "vue";
import ModalWindow from "./ModalWindow.vue";

const props = defineProps<{
    open: boolean;
    title: string;
    readonly : boolean;
    code : number | null;
}>();

const emit = defineEmits(['close', 'submit']);

const inputs = ref<string[]>(["", "", "", ""]);

const submit = () => {
  const code = parseInt(inputs.value[0]) * 1000 + parseInt(inputs.value[1]) * 100 + parseInt(inputs.value[2]) * 10 + parseInt(inputs.value[3]);
  emit('submit', code);
  emit('close');
  inputs.value = ["", "", "", ""]
};

function checkLimitations(){
  for(var i = 0; i < inputs.value.length; i++){
    if(!(inputs.value[i] >= '0' && inputs.value[i] <= '9'))
      inputs.value[i] = '';
    inputs.value[i] = inputs.value[i].slice(0, 1);
  }
}

const closeModal = () => {
  inputs.value = ["", "", "", ""]
  emit('close');
}

</script>

<template>

  <ModalWindow :title="props.title" v-on:close="$emit('close')" :open="props.open">
    <div class="flex justify-center space-x-2">
            <input
              v-for="(value, index) in inputs"
              :key="index"
              v-model="inputs[index]"
              type="text"
              class="w-12 h-8 rounded-md border-gray-300 text-center shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @input="checkLimitations"
              placeholder="0"
              :readonly="props.readonly"
            />
      </div>

      <template #buttons>
        <button type="button" 
                class="mt-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-300" 
                @click="closeModal">Cancel</button>
        <button type="button" 
                class="mt-3 inline-flex justify-center rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm ring-1 ring-inset ring-primary hover:bg-blue-600" 
                @click="submit">Import</button>
      </template>
  </ModalWindow>
</template>
