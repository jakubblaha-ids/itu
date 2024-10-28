<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Back from '$icons/back.icon.svelte';
	import Check from '$icons/check.icon.svelte';
	import ChevronDown from '$icons/chevron-down.icon.svelte';
	import Search from '$icons/search.icon.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import ItemList from '$lib/ItemList.svelte';
	import QuantityChangeBar from '$lib/QuantityChangeBar.svelte';
	import SearchModal from '$lib/SearchModal.svelte';
	import { itemManager, listManager } from '$ts/stores';
	import type { InListItem } from 'backend';
	import { expoOut } from 'svelte/easing';
	import { get } from 'svelte/store';
	import { fly } from 'svelte/transition';

	const { itemsToAddStore, addItemHighlightId } = listManager;

	const initHighlightId = get(addItemHighlightId);
	const initHighlightItem: InListItem | null =
		$itemsToAddStore.find((item) => item.id === initHighlightId) || null;

	let highlightItem = $state(initHighlightItem);

	$effect(() => {
		if (highlightItem) {
			listManager.addItemHighlightId.set(highlightItem.id);
		}
	});

	let showSearchModal = $state(false);
	let showRecentlyUsed = $state(true);

	let addingIds = $derived($itemsToAddStore.map((i) => i.itemId));
	let inListIds = $derived(listManager.selectedListData?.listItems.map((i) => i.itemId) || []);
	let ignoredIds = $derived([...addingIds, ...inListIds]);
	let renderedRecentlyUsedItems = $derived(
		itemManager.getRecentlyUsedItems().filter((i) => !ignoredIds.includes(i.itemId))
	);
</script>

<div class="flex flex-col h-full">
	<div class="bg-darker px-2 py-2 text-center">Add Items</div>

	<ItemList bind:highlightItem items={$itemsToAddStore} />

	<button
		onclick={() => (showRecentlyUsed = !showRecentlyUsed)}
		class="bg-darker px-3 py-2 flex text-left items-center border-b border-darkest"
	>
		<div class="flex-grow text-gray-200 font-medium">Recently used</div>

		<div class:rotate-180={!showRecentlyUsed} class="w-4 duration-500">
			<ChevronDown />
		</div>
	</button>

	<div class:!max-h-0={!showRecentlyUsed} class="duration-200 transition-all max-h-32">
		<div class="flex flex-wrap px-3 gap-x-2 gap-y-2.5 py-2.5 overflow-y-scroll">
			{#if browser}
				{#each renderedRecentlyUsedItems as item}
					<button
						onclick={() => listManager.addRecentlyUsedItemToAddedItems(item)}
						class="flex items-center rounded-full bg-light select-none duration-100 text-sm text-gray-200"
					>
						<div class="flex py-2 px-4 w-full flex-shrink-0 duration-100 items-center">
							<div class="flex-grow">
								{itemManager.getNameOfitemId(item.itemId)}
							</div>

							<!-- <div>
							{item.amount}
							{item.unit}
						</div> -->
						</div>
					</button>
				{:else}
					<div
						class="text-gray-200 grid place-items-center w-full text-sm opacity-75 font-medium h-14"
					>
						No recently used items
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<QuantityChangeBar
		inListItem={highlightItem}
		disabled={$itemsToAddStore.length < 1}
		suggestedQuantities={itemManager?.getSuggestedQuantities(null) || []}
		plusClick={() => listManager.increaseAmountToAdd(highlightItem!.id)}
		minusClick={() => listManager.decreaseAmountToAdd(highlightItem!.id)}
		setQuantity={(amount, unit) => {
			listManager?.setAmountToAdd(highlightItem!.id, amount, unit);
		}}
		setCustomAmount={(customAmount) => {
			listManager?.setAmountToAdd(highlightItem!.id, customAmount, 'custom');
		}}
	/>

	<BottomNavContainer>
		<button onclick={() => goto('/')}> <Back /> </button>
		<button onclick={() => (showSearchModal = true)}> <Search /> </button>
		<button
			onclick={() => {
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
