import { writable } from 'svelte/store';
import { ItemManager } from './ItemManager';
import { ListManager } from './ListManager';
import { UserManager } from './UserManager';

export const itemManager = new ItemManager();
export const userManager = new UserManager();
export const listManager = new ListManager(itemManager, userManager);

export const screenHeight = writable(0);
