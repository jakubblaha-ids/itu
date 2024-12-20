// author: Pavel Lukl, xluklp00
// helper for modal type components

import { writable, type Writable } from "svelte/store";
import ImportModal from '$lib/components/modals/ImportModal.svelte';
import UserModal from '$lib/components/modals/UserModal.svelte';
import MenuModal from "$lib/components/modals/MenuModal.svelte";

// ModalName type
export type ModalName = 'import' | 'user' | 'menu' | 'add-item' | null;

// activeModal store
export const activeModal: Writable<ModalName> = writable(null);

// name to modal component mapping
export const NameToModal: Record<Exclude<ModalName, null | 'add-item'>, any | null> = {
    'import': ImportModal,
    'user': UserModal,
    'menu': MenuModal
};