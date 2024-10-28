<script lang="ts">
	import { goto } from '$app/navigation';
	import Back from '$icons/back.icon.svelte';
	import Check from '$icons/check.icon.svelte';
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
</script>

<div class="flex flex-col h-full">
	<div class="bg-darker px-2 py-2">Will be added</div>

	<ItemList bind:highlightItem items={$itemsToAddStore} />

	<div class="bg-darker px-2 py-2">Recently used</div>

	<div class="grid px-3 gap-y-3 py-3 flex-grow overflow-scroll">
		<!-- {#each testItems as item}
			<SimplifiedItemButton {item} />
		{/each} -->
	</div>

	<QuantityChangeBar
		disabled={$itemsToAddStore.length < 1}
		disableDecreaseButton={highlightItem?.itemAmount === 1}
		suggestedQuantities={itemManager?.getSuggestedQuantities(null) || []}
		plusClick={() => listManager.increaseAmountToAdd(highlightItem!.id)}
		minusClick={() => listManager.decreaseAmountToAdd(highlightItem!.id)}
		setQuantity={(amount, unit) => {
			listManager?.setAmountToAdd(highlightItem!.id, amount, unit);
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
