<script lang="ts">
	import { browser } from '$app/environment';
	import Back from '$icons/back.icon.svelte';
	import Check from '$icons/check.icon.svelte';
	import Search from '$icons/search.icon.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import QuantityChangeBar from '$lib/QuantityChangeBar.svelte';
	import SearchModal from '$lib/SearchModal.svelte';
	import { itemManager, listManager } from '$ts/global';
	import type { InListItem } from 'backend';
	import { onMount } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let props: { goBack: () => void } = $props();

	const { itemsToAddStore } = listManager;

	let showSearchModal = $state(false);
	let showRecentlyUsed = $state(true);

	let inListIds = $derived(listManager.selectedListData?.listItems.map((i) => i.itemId) || []);
	let ignoredIds = $derived([...inListIds]);
	let renderedRecentlyUsedItems = $derived(
		browser ? itemManager.getRecentlyUsedItems().filter((i) => !ignoredIds.includes(i.itemId)) : []
	);

	let itemToAdd = $state<InListItem | null>(null);

	$effect(() => {
		itemToAdd = $itemsToAddStore[0];
	});

	onMount(() => {
		if (!itemToAdd) {
			listManager.addItemToList(null, '');
		}
	});
</script>

<div class="flex flex-col h-full z-0 relative">
	<div
		class="bg-light shadow-lg rounded-xl py-4 mx-4 mt-4 flex flex-col mb-6 items-center font-semibold h-40 justify-center"
	>
		<div class="text-2xl font-black">
			{#if itemToAdd?.itemId}
				{itemManager.getNameOfitemId(itemToAdd.itemId)}
			{:else if itemToAdd?.customItemName}
				{itemToAdd.customItemName}
			{:else}
				<span class="opacity-50"> ~~~~~ </span>
			{/if}
		</div>

		<div class="text-xl mt-1 text-gray-200">
			{itemToAdd?.itemAmount}
			{itemToAdd?.itemUnit !== 'custom' ? itemToAdd?.itemUnit : ''}
		</div>
	</div>

	<div
		class="bg-darkest px-3 flex text-left items-center border-b border-darkest py-2 text-gray-200 font-semibold rounded-t-lg"
	>
		Recently used
	</div>

	<div class:!max-h-0={!showRecentlyUsed} class="duration-200 transition-all flex-grow">
		<div
			class="flex flex-wrap px-3 gap-x-2 gap-y-2.5 py-2.5 overflow-y-scroll"
			class:h-full={renderedRecentlyUsedItems.length < 1}
		>
			{#if browser}
				{#each renderedRecentlyUsedItems as item}
					<button
						onclick={() => {
							listManager.clearItemsToAdd();
							listManager.addRecentlyUsedItemToAddedItems(item);
						}}
						class="flex items-center rounded-full bg-light select-none duration-100 text-sm text-gray-200 h-max font-medium"
						class:bg-lightest={itemToAdd && itemToAdd.itemId === item.itemId}
					>
						<div class="flex py-3 px-4 w-full flex-shrink-0 duration-100 items-center">
							<div class="flex-grow">
								{itemManager.getNameOfitemId(item.itemId)}
							</div>
						</div>
					</button>
				{:else}
					<div
						class="text-gray-200 grid place-items-center w-full text-sm opacity-75 font-medium flex-grow"
					>
						No recently used items
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<QuantityChangeBar
		inListItem={itemToAdd}
		suggestedQuantities={itemManager?.getSuggestedQuantities(null) || []}
		plusClick={() => listManager.increaseAmountToAdd(itemToAdd!.id)}
		minusClick={() => listManager.decreaseAmountToAdd(itemToAdd!.id)}
		setQuantity={(amount, unit) => {
			listManager?.setAmountToAdd(itemToAdd!.id, amount, unit);
		}}
		setCustomAmount={(customAmount) => {
			listManager?.setAmountToAdd(itemToAdd!.id, customAmount, 'custom');
		}}
	/>

	<BottomNavContainer>
		<button onclick={props.goBack}> <Back /> </button>
		<button onclick={() => (showSearchModal = true)}> <Search /> </button>
		<button
			disabled={itemToAdd?.itemId === null && !itemToAdd?.customItemName}
			onclick={() => {
				listManager.commitAddingItems();
				props.goBack();
			}}
		>
			<div class="w-6">
				<Check />
			</div>
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
