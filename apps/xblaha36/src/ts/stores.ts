import { ItemManager } from './ItemManager';
import { ListManager } from './ListManager';
import { browser } from '$app/environment';

export const listManager = (browser ? new ListManager() : null) as ListManager;
export const itemManager = (browser ? new ItemManager() : null) as ItemManager;
