<script setup lang="ts">
import ModalWindow from "./ModalWindow.vue";

const props = defineProps<{
    open: boolean;
    title: string;
    readonly : boolean;
    code : number | null;
}>();

const emit = defineEmits(['close']);

</script>

<template>
  <ModalWindow :title="props.title" v-on:close="$emit('close')" :open="props.open">
    <div class="flex justify-center space-x-2 mx-20">{{ props.code }}</div>
  </ModalWindow>
</template>
