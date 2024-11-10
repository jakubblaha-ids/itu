import { writable, type Writable } from 'svelte/store';
import { ItemManager } from './ItemManager';
import { ListManager } from './ListManager';
import { UserManager } from './UserManager';
import ImportModal from '$lib/components/modals/ImportModal.svelte';
import type { Component } from 'svelte';
import UserModal from '$lib/components/modals/UserModal.svelte';

export const itemManager = new ItemManager();
export const userManager = new UserManager();
export const listManager = new ListManager(itemManager, userManager);

export type ModalName = 'import' | 'user' | 'menu' | 'add-item' | null;

export const activeModal: Writable<ModalName> = writable(null);

// Dynamically import modal components based on modal name
export const NameToModal: Record<Exclude<ModalName, null>, Component | null> = {
    'import': ImportModal,
    'user': UserModal,
    'menu': null,
    'add-item': null
};