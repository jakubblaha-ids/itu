import { writable, type Writable } from 'svelte/store';
import { ItemManager } from './ItemManager';
import { ListManager } from './ListManager';
import { UserManager } from './UserManager';
import ImportModal from '$lib/components/modals/ImportModal.svelte';
import type { Component } from 'svelte';
import UserModal from '$lib/components/modals/UserModal.svelte';
import { initializeApp } from 'firebase/app';

export const itemManager = new ItemManager();
export const userManager = new UserManager();
export const listManager = new ListManager(itemManager, userManager);

export type ModalName = 'import' | 'user' | 'menu' | 'add-item' | null;

export const activeModal: Writable<ModalName> = writable(null);

const firebaseConfig = {
    apiKey: 'AIzaSyDpqj7ycSm2NPYE1OjAIjsWgnbY3OmvXsk',
    authDomain: 'shopping-list-b47e8.firebaseapp.com',
    projectId: 'shopping-list-b47e8',
    storageBucket: 'shopping-list-b47e8.appspot.com',
    messagingSenderId: '83924909024',
    appId: '1:83924909024:web:4bec0e1d9bcdd1956f8985'
};

initializeApp(firebaseConfig);

export const NameToModal: Record<Exclude<ModalName, null>, Component | null> = {
    'import': ImportModal,
    'user': UserModal,
    'menu': null,
    'add-item': null
};