<!-- Author: Pavel Lukl, xluklp00 -->

<script lang="ts">
	import { itemManager, listManager } from '$lib/script';
	import { onMount } from 'svelte';

	// Refresh available items, lists and select last selected list on mount
	onMount(() => {
		itemManager.refreshAvailableItems();
		listManager.selectLastSelectedList();
		listManager.refreshAvailableLists();
	});
</script>
