<!--
Jakub Blaha, xblaha36

Component to be imported in a layout. Initializes firebase and
managers from the backend serving as interface to firestore.
-->

<script lang="ts">
	import { itemManager, listManager } from '$ts/global';
	import { initializeApp } from 'firebase/app';
	import { onMount } from 'svelte';

	const firebaseConfig = {
		apiKey: 'AIzaSyDpqj7ycSm2NPYE1OjAIjsWgnbY3OmvXsk',
		authDomain: 'shopping-list-b47e8.firebaseapp.com',
		projectId: 'shopping-list-b47e8',
		storageBucket: 'shopping-list-b47e8.appspot.com',
		messagingSenderId: '83924909024',
		appId: '1:83924909024:web:4bec0e1d9bcdd1956f8985'
	};

	onMount(() => {
		initializeApp(firebaseConfig);

		itemManager.refreshAvailableItems();
		listManager.selectLastSelectedList();
		listManager.refreshAvailableLists();
	});
</script>
