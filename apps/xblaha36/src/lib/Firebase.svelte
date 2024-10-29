<script lang="ts">
	import { itemManager, listManager } from '$ts/stores';
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
