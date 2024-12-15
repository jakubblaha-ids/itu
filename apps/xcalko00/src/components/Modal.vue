<!-- Autor: Veronika Calkovska (xcalko00) -->

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { type Item } from 'backend';

const open = ref(true)
const text = ref('1')
const newAmount = ref(0); 
const amountUnit = ref('pcs');
const customAmountUnit = ref('');

const props = defineProps<{
    name: string;
    amount: number,
    item: Item | undefined,
    unit: string;
    close(unit: string, amount:number): void;
    cancel(item: Item): void;
}>()

/**
 * 
 * @param event event cought from input form as text and parsed as integer as new amount of the item 
 */
 function onInput(event: Event) {
  const inputElement = event.target as HTMLInputElement;

  inputElement.value = inputElement.value.replace(/\D/g, '');

  text.value = inputElement.value;
  newAmount.value = parseInt(text.value) || 1; 
}

const setAmountUnit = (unit: string):void => {
    amountUnit.value = unit
}

const setAmount = (amount: number):void => {
    newAmount.value += amount;
    if(newAmount.value <= 0){
        newAmount.value = 1;
        text.value = '1';
        return;
    }
    text.value = newAmount.value.toString();
}

const saveAndClose = (): void =>{
    if(newAmount.value <= 0)
        newAmount.value = 1;
    if(amountUnit.value == 'custom')
        amountUnit.value = customAmountUnit.value;
    props.close(amountUnit.value, newAmount.value);
    open.value = false;
}

const cancel = (item:Item): void => {
    props.cancel(item);
    open.value = false;
}

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
                        <DialogTitle as="h3" class="text-base font-semibold text-gray-900 mt-4">{{ props.name }}</DialogTitle>
                        <div class="mt-2 flex flex-col gap-2 items-center">
                        
                        <div class="flex flex-row gap-1">
                            <button v-if="amountUnit == 'g'" type="button" class="text-white bg-primary hover:text-white border border-blue-700 hover:bg-primary focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-white dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">g</button>
                            <button v-else @click="setAmountUnit('g')" type="button" class="text-black hover:text-white border border-blue-700 hover:bg-primary focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">g</button>
                            <button v-if="amountUnit == 'ml'" type="button" class="text-white bg-primary hover:text-white border border-blue-700 hover:bg-primary focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-white dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">ml</button>
                            <button v-else  @click="setAmountUnit('ml')" type="button" class="text-black hover:text-white border border-blue-700 hover:bg-primary focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">ml</button>
                            <button v-if="amountUnit == 'pcs'" type="button" class="text-white bg-primary hover:text-white border border-blue-700 hover:bg-primary focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-white dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">pcs</button>
                            <button v-else @click="setAmountUnit('pcs')" type="button" class="text-black hover:text-white border border-blue-700 hover:bg-primary focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">pcs</button>
                            <button v-if="amountUnit == 'custom'" type="button" class="text-white bg-primary hover:text-white border border-blue-700 hover:bg-primary focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-white dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">custom</button>
                            <button v-else @click="setAmountUnit('custom')" type="button" class="text-black hover:text-white border border-blue-700 hover:bg-primary focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">custom</button>
                            <div v-if="amountUnit == 'custom'" class="m-1 w-23">
                                <div class="w-32 flex items-center rounded-md bg-white pl-3outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <div class="shrink-0 select-none rounded-md text-base text-gray-500 sm:text-sm/6"></div>
                                    <input v-model="customAmountUnit" type="text" name="CustomAmountUnitInput" id="filter" class="block min-w-0 grow py-0 w-20 pl-1 pr-1 rounded-md text-center text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6" placeholder='teaspoon' />
                                </div>
                            </div> 
                        </div>

                        <div class="m-1 w-20">
                            <div class="flex items-center rounded-md bg-white pl-3outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                <div class="shrink-0 select-none rounded-md text-base text-gray-500 sm:text-sm/6"></div>
                                <input @input="onInput" v-model="text" type="text" name="filter" id="filter" class="block min-w-0 grow py-0 w-20 pl-1 pr-1 rounded-md text-center text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6" placeholder='1' />
                            </div>
                        </div>
                      </div>
                        <div class="flex flex-row justify-center mt-3 gap-5">
                            <div class="flex flex-row">
                                <button @click="setAmount(-1)" type="button" class="text-black  border border-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">-1</button> 
                                <button @click="setAmount(-10)" type="button" class="text-black  border border-black  focus:ring-4 focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">-10</button>
                                <button @click="setAmount(-100)" type="button" class="text-black  border border-black  focus:ring-4 focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">-100</button>  
                            </div>
                            <div class="flex flex-row"> 
                                <button @click="setAmount(1)" type="button" class="text-black  border border-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">+1</button> 
                                <button @click="setAmount(10)" type="button" class="text-black  border border-black  focus:ring-4 focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">+10</button>
                                <button @click="setAmount(100)" type="button" class="text-black  border border-black  focus:ring-4 focus:outline-none focus:ring-blue-300 font-light rounded-lg text-xs px-1  text-center me-1 mb-1 dark:border-primary dark:text-primary dark:hover:text-white dark:hover:bg-primary dark:focus:ring-primary">+100</button>  
                            </div>
                        </div> 
                    </div>

                  </div>
                </div>
                <div class="bg-gray-50 px-auto py-3 sm:flex sm:flex-row-reverse sm:px-6 flex flex-row gap-5 justify-center">
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white mx-4 px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="cancel(props.item!)" ref="cancelButtonRef">Cancel</button>
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-primary mx-4 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-primary hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="saveAndClose" ref="cancelButtonRef">OK</button> 
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</template>
  
