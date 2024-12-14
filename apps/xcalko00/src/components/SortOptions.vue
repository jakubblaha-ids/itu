<script setup lang="ts">
import { ref } from 'vue';


const open = ref(true)
</script>

<template>
    <TransitionRoot as="template" :show="open">
        <Dialog class="fixed inset-0 z-[9999] flex items-end justify-center" @close="open = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed w-full m-0 justify-around">
          <div class="flex min-h-full items-end justify-center text-center z-10 w-full m-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <DialogPanel class="w-full bg-white text-left shadow-xl transition-all">
                <div class="bg-white pb-4">
                  <div class="items-center">
                    <div class="mt-1 text-center items-center">
                        <DialogTitle as="h3" class="text-base font-semibold text-gray-900 mt-4">{{ "Sort options" }}</DialogTitle>
                    </div>
                  </div>
                </div> 

                     
                <div class="bg-gray-50 px-auto py-3 sm:flex sm:flex-row-reverse sm:px-6 flex flex-row gap-5 justify-center">
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white mx-4 px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="" ref="cancelButtonRef">Cancel</button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-primary mx-4 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="" ref="cancelButtonRef">OK</button> 
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>
  
