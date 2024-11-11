import { ItemManager } from './ItemManager';
import { ListManager } from './ListManager';
import { UserManager } from './UserManager';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyDpqj7ycSm2NPYE1OjAIjsWgnbY3OmvXsk',
    authDomain: 'shopping-list-b47e8.firebaseapp.com',
    projectId: 'shopping-list-b47e8',
    storageBucket: 'shopping-list-b47e8.appspot.com',
    messagingSenderId: '83924909024',
    appId: '1:83924909024:web:4bec0e1d9bcdd1956f8985'
};

initializeApp(firebaseConfig);

export const itemManager = new ItemManager();
export const userManager = new UserManager();
export const listManager = new ListManager(itemManager, userManager);
