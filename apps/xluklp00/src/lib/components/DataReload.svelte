<script lang="ts">
	import { itemManager, listManager } from '$lib/script';
	import { onMount } from 'svelte';

	onMount(() => {
		itemManager.refreshAvailableItems();
		listManager.selectLastSelectedList();
		listManager.refreshAvailableLists();
	});
</script>
