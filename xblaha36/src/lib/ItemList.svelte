<script lang="ts">
	import type { InListItem } from '$ts/types';
	import ItemListItem from './ItemListItem.svelte';

	export let items: InListItem[] = [];

	let highlightIndex = 0;
</script>

<div class="flex-grow flex flex-col px-3 py-4 gap-y-3">
	{#each items as item, index}
		<ItemListItem
			{item}
			highlight={index === highlightIndex}
			on:item-click={() => (highlightIndex = index)}
		/>
	{/each}
</div>
