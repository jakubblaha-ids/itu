import { ItemManager } from './ItemManager';
import { ListManager } from './ListManager';

export const itemManager = new ItemManager();
export const listManager = new ListManager(itemManager);
