<!-- 
Jakub Blaha, xblaha36

A modal with a search input used for searching in a predefined list of items.
-->

<script lang="ts">
	import Back from '$icons/back.icon.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import SimplifiedItemButton from '$lib/components/SimplifiedItemButton.svelte';
	import BottomNavContainer from '$lib/components/BottomNavContainer.svelte';
	import { itemManager, listManager } from '$ts/global';
	import ItemList from '$lib/components/ItemList.svelte';
	import Down from '$icons/down.arrow.svelte';
	import type { Item } from 'backend';
	import Check from '$icons/check.icon.svelte';
	import FloatingButton from '$lib/components/FloatingButton.svelte';
	import Search from '$icons/search.icon.svelte';

	const dispatch = createEventDispatcher();

	let input: HTMLInputElement;

	let searchValue = '';

	$: filtItems = itemManager.getAvailableItems(searchValue) || [];
	$: filtSorted = filtItems.toSorted((a, b) =>
		(a.categoryName + a.name).localeCompare(b.categoryName + b.name)
	);

	let initialViewportHeight: number | null = 0;

	// Focus the input and display keyboard when the component appears.
	onMount(() => {
		input.focus();

		initialViewportHeight = window.visualViewport?.height ?? null;

		window.visualViewport?.addEventListener('resize', () => {
			oskShown = window.visualViewport?.height !== initialViewportHeight;
		});
	});

	function addHighlightedOrCustomItem() {
		if (filtItems.length > 0) {
			listManager.setItemToAdd(highlightItem!.id, null);
		} else {
			listManager.setItemToAdd(null, searchValue);
		}

		dispatch('back-click');
	}

	let highlightItem: Item | null = null;

	// On screen keyboard shown
	let oskShown = false;

	function showOsk() {
		input.focus();
	}
</script>

<div class="h-full bg-darkest flex flex-col z-40 relative">
	<!-- Search input -->
	<input
		bind:this={input}
		type="text"
		class="h-20 px-8 w-full bg-darker outline-none text-xl flex-shrink-0 font-semibold placeholder-gray-300"
		bind:value={searchValue}
		onkeydown={(event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				addHighlightedOrCustomItem();
			}
		}}
		placeholder="Search..."
	/>

	{#if filtItems.length > 0}
		<ItemList
			items={filtSorted}
			bottomSectionTitle="Already on list"
			isItemInBottomSection={(item) => (item ? listManager.getAmountOnList(item.id) !== '' : false)}
			bind:highlightItem
		>
			{#snippet itemRenderer(item, highlight)}
				{@const amountOnList = listManager.getAmountOnList(item.id) || ''}

				<SimplifiedItemButton
					{highlight}
					{item}
					subtitle={item.categoryName +
						(amountOnList ? ' | ' + amountOnList + ' already on list' : '')}
					on:click={() => {
						listManager.setItemToAdd(item.id, null);

						dispatch('back-click');
					}}
				/>
			{/snippet}
		</ItemList>
	{:else}
		<div
			class="flex-grow text-center px-10 flex flex-col items-center gap-y-2 justify-center font-semibold text-gray-200"
		>
			<div>Such item was not found, but don't worry. Click below to add a custom item.</div>

			<div class="w-8">
				<Down />
			</div>
		</div>
	{/if}

	<BottomNavContainer>
		<!-- Back button -->
		<button onclick={() => dispatch('back-click')}>
			<Back />
		</button>

		<!-- Add custom item button -->
		<button
			class="font-medium"
			onclick={() => {
				listManager.setItemToAdd(null, searchValue);
				dispatch('back-click');
			}}
		>
			Custom
		</button>

		<!-- Add first item in results list button -->
		<button disabled={!highlightItem || filtItems.length < 1} onclick={addHighlightedOrCustomItem}>
			<div class="w-6">
				<Check />
			</div>
		</button>
	</BottomNavContainer>

	<!-- Button to focus input and show onscreen input so that the user doesn't need to reach
	 with their thumb to the top of the screen. -->
	{#if !oskShown}
		<FloatingButton class="bg-lighter" onclick={showOsk}>
			<Search />
		</FloatingButton>
	{/if}
</div>

<style>
	button {
		@apply bg-light rounded-lg active:brightness-90 duration-100 grid place-items-center flex-grow;
	}
</style>
