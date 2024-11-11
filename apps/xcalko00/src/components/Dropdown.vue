<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  title: string
  returnOption (option: string): void;
}>()

</script>

<template>
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton class="sortoptions">
          {{ props.title }}
          <ChevronDownIcon class="smallicon" aria-hidden="true" />
        </MenuButton>
      </div>
  
      <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
        <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div class="py-1">
            <MenuItem v-slot="{ active }">
              <a href="#" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']" @click="returnOption('Category')">Category</a>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <a href="#" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']" @click="returnOption('Name')">Name</a>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </template>

<style>
.sortoptions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background-color: rgba(186, 211, 212, 1);
  font-size: 1rem;
  vertical-align: middle;
}


</style>
