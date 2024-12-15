<!-- Autor: Veronika Calkovska (xcalko00) -->

<script setup lang="ts">
import { TransitionRoot, Dialog, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/vue";

const props = defineProps<{
  open: boolean;
  title?: string;
}>()

const emit = defineEmits(['close']);
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="fixed inset-0 z-[9999] flex items-center justify-center" @close="$emit('close')">
      <div class="fixed m-0 justify-around">
        <div class="flex min-h-full items-end justify-center text-center z-10 m-0">
          <TransitionChild as="template"
            enter="ease-out duration-300" 
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" 
            enter-to="opacity-100 translate-y-0 sm:scale-100" 
            leave="ease-in duration-200" 
            leave-from="opacity-100 translate-y-0 sm:scale-100" 
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="w-full bg-white text-left shadow-xl transition-all rounded-lg">
              <div class="bg-white pb-4">
                <div class="items-center">
                  <div class="mt-1 text-center items-center">
                    <DialogTitle as="h3" class="text-base font-semibold text-gray-900 mt-4">{{ title }}</DialogTitle>
                  </div>
                </div>
              </div>

              <div class="p-4">
                <slot />
              </div>

              <div class="bg-gray-50 px-auto py-3 flex flex-row gap-5 justify-around">
                <slot name="buttons">
                  <button type="button" 
                          class="mt-3 inline-flex w-full justify-center rounded-md bg-white mx-4 px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 sm:mt-0 sm:w-auto" 
                          @click="$emit('close')">Cancel</button>
                </slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
