<script lang="ts">
	import { goto } from '$app/navigation';
	import Back from '$icons/back.icon.svelte';
	import Check from '$icons/check.icon.svelte';
	import Search from '$icons/search.icon.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import ItemList from '$lib/ItemList.svelte';
	import QuantityChangeBar from '$lib/QuantityChangeBar.svelte';
	import SearchModal from '$lib/SearchModal.svelte';
	import SimplifiedItemButton from '$lib/SimplifiedItemButton.svelte';
	import { itemManager, listManager } from '$ts/stores';
	import { expoOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let showSearchModal = false;

	const _itemsToAdd = listManager?.itemsToAdd;
	$: itemsToAdd = $_itemsToAdd || [];

	const addItemHighlightIndex = listManager?.addItemHighlightIndex;
</script>

<div class="flex flex-col h-full">
	<div class="bg-darker px-2 py-2">Will be added</div>

	<ItemList
		highlightIndex={$addItemHighlightIndex}
		items={itemsToAdd}
		on:highlight-index={(e) => {
			listManager?.addItemHighlightIndex.set(e.detail);
		}}
	/>

	<div class="bg-darker px-2 py-2">Recently used</div>

	<div class="grid px-3 gap-y-3 py-3 flex-grow overflow-scroll">
		<!-- {#each testItems as item}
			<SimplifiedItemButton {item} />
		{/each} -->
	</div>

	<QuantityChangeBar
		disabled={itemsToAdd.length < 1}
		disableDecreaseButton={itemsToAdd[$addItemHighlightIndex || 0]?.itemAmount === 1}
		suggestedQuantities={itemManager?.getSuggestedQuantities(null) || []}
	/>

	<BottomNavContainer>
		<button on:click={() => goto('/')}> <Back /> </button>
		<button on:click={() => (showSearchModal = true)}> <Search /> </button>
		<button
			on:click={() => {
				listManager?.commitAddingItems();
				goto('/');
			}}
		>
			<Check />
		</button>
	</BottomNavContainer>
</div>

{#if showSearchModal}
	<div
		class="absolute inset-0"
		in:fly={{ y: 1000, duration: 500, opacity: 1, easing: expoOut }}
		out:fly={{ y: 1000, duration: 800, opacity: 1, easing: expoOut }}
	>
		<SearchModal on:back-click={() => (showSearchModal = false)} />
	</div>
{/if}
