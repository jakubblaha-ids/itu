import { writable, type Writable } from "svelte/store";
import ImportModal from '$lib/components/modals/ImportModal.svelte';
import type { Component } from 'svelte';
import UserModal from '$lib/components/modals/UserModal.svelte';
import MenuModal from "$lib/components/modals/MenuModal.svelte";

export type ModalName = 'import' | 'user' | 'menu' | 'add-item' | null;

export const activeModal: Writable<ModalName> = writable(null);

export const NameToModal: Record<Exclude<ModalName, null | 'add-item'>, any | null> = {
    'import': ImportModal,
    'user': UserModal,
    'menu': MenuModal
};