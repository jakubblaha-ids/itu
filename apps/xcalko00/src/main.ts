import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app';
import { itemManager, userManager } from './managers/list';
import { listManager } from './managers/list';

const firebaseConfig = {
    apiKey: 'AIzaSyDpqj7ycSm2NPYE1OjAIjsWgnbY3OmvXsk',
    authDomain: 'shopping-list-b47e8.firebaseapp.com',
    projectId: 'shopping-list-b47e8',
    storageBucket: 'shopping-list-b47e8.appspot.com',
    messagingSenderId: '83924909024',
    appId: '1:83924909024:web:4bec0e1d9bcdd1956f8985'
};

initializeApp(firebaseConfig);

// localStorage.clear();
// sessionStorage.clear();

itemManager.refreshAvailableItems();
listManager.refreshAvailableLists();

const app = createApp(App)

app.provide('itemManager', itemManager)
app.provide('listManager', listManager)
app.provide('userManager', userManager)
app.use(router)

app.mount('#app')
