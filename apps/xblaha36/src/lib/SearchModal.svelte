<script lang="ts">
	import Back from '$icons/back.icon.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import SimplifiedItemButton from './SimplifiedItemButton.svelte';
	import BottomNavContainer from './BottomNavContainer.svelte';
	import { itemManager, listManager } from '$ts/stores';
	import ItemList from './ItemList.svelte';
	import Down from '$icons/down.arrow.svelte';
	import type { Item } from 'backend';
	import Check from '$icons/check.icon.svelte';

	const dispatch = createEventDispatcher();

	let input: HTMLInputElement;

	let searchValue = '';

	$: filtItems = itemManager?.getAvailableItems(searchValue) || [];

	onMount(() => {
		input.focus();
	});

	let highlightItem: Item | null = null;
</script>

<div class="h-full bg-darkest flex flex-col z-40 relative">
	<input
		bind:this={input}
		type="text"
		class="h-20 px-8 w-full bg-darker outline-none text-xl flex-shrink-0 font-semibold placeholder-gray-300"
		bind:value={searchValue}
		placeholder="Search..."
	/>

	{#if filtItems.length > 0}
		<ItemList
			items={filtItems}
			bottomSectionTitle="Already on list"
			isItemInBottomSection={(item) => (item ? listManager.getAmountOnList(item.id) !== '' : false)}
			bind:highlightItem
		>
			{#snippet itemRenderer(item, highlight)}
				{@const amountOnList = listManager.getAmountOnList(item.id) || ''}

				<SimplifiedItemButton
					{highlight}
					{item}
					subtitle={amountOnList ? amountOnList + ' already on list' : ''}
					on:click={() => {
						listManager!.setItemToAdd(item.id, null);

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
		<button on:click={() => dispatch('back-click')}>
			<Back />
		</button>

		<button
			class="font-medium"
			on:click={() => {
				listManager?.setItemToAdd(null, searchValue);
				dispatch('back-click');
			}}
		>
			Custom
		</button>

		<button
			disabled={!highlightItem || filtItems.length < 1}
			on:click={() => {
				listManager?.setItemToAdd(highlightItem!.id, null);
				dispatch('back-click');
			}}
		>
			<Check />
		</button>
	</BottomNavContainer>
</div>

<style>
	button {
		@apply bg-light rounded-lg active:brightness-90 duration-100 grid place-items-center flex-grow;
	}
</style>
