<script lang="ts">
	import Back from '$icons/back.icon.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import SimplifiedItemButton from './SimplifiedItemButton.svelte';
	import BottomNavContainer from './BottomNavContainer.svelte';
	import { itemManager, listManager } from '$ts/stores';

	const dispatch = createEventDispatcher();

	let input: HTMLInputElement;

	let searchValue = '';

	$: filtItems = itemManager?.getAvailableItems(searchValue) || [];

	onMount(() => {
		input.focus();
	});
</script>

<div class="h-full bg-darkest flex flex-col z-40 relative">
	<input
		bind:this={input}
		type="text"
		class="h-20 px-8 w-full bg-darker outline-none text-xl flex-shrink-0"
		bind:value={searchValue}
	/>

	<div class="flex flex-col px-3 gap-y-3 py-3 flex-grow overflow-scroll">
		{#each filtItems as item, index}
			{@const amountOnList = listManager?.getAmountOnList(item.id) || ''}

			<SimplifiedItemButton
				on:click={() => {
					listManager!.setItemToAdd(item.id, null);

					dispatch('back-click');
				}}
				{item}
				highlight={index === 0}
				subtitle={amountOnList ? amountOnList + ' already on list' : ''}
			/>
		{/each}
	</div>

	<BottomNavContainer>
		<button on:click={() => dispatch('back-click')}>
			<Back />
		</button>

		<button
			on:click={() => {
				listManager?.setItemToAdd(null, searchValue);
				dispatch('back-click');
			}}
		>
			Custom
		</button>

		<button
			on:click={() => {
				listManager?.setItemToAdd(filtItems[0].id, null);
				dispatch('back-click');
			}}
		>
			First
		</button>
	</BottomNavContainer>
</div>

<style>
	button {
		@apply bg-light rounded-lg active:brightness-90 duration-100 grid place-items-center flex-grow;
	}
</style>
