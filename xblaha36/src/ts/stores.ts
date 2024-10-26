import type { Firestore } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { ItemManager } from './ItemManager';
import { ListManager } from './ListManager';
import { browser } from '$app/environment';

export const db = writable<Firestore>();

export const listManager = browser ? new ListManager() : null;
export const itemManager = browser ? new ItemManager() : null;
