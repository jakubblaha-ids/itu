<script setup lang="ts">
import { ref, onMounted } from "vue";
import ModalWindow from "./ModalWindow.vue";

const name = ref('')

const props = defineProps<{
    open: boolean;
    title: string;
    name: string;
}>();

onMounted(() => {
  name.value = props.name;
});

const emit = defineEmits(['close', 'submit']);

const submit = () => {
  emit('submit', name.value);
  emit('close');
};

</script>

<template>
    <ModalWindow :title="'User'" v-on:close="$emit('close')" :open="props.open">
        <div class="flex justify-center space-x-2">
            <input
              v-model="name"
              type="text"
              class="w-full h-6 rounded-md border-gray-300 text-center shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>  

          <template #buttons>
            <button
              type="button"
              class="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="button"
              class="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50"
              @click="submit"
            >
              Save
            </button> 
          </template>
    </ModalWindow>
</template>
