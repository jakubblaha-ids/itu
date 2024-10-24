<script lang="ts">
	import { goto } from '$app/navigation';
	import Back from '$icons/back.icon.svelte';
	import type { InListItem } from '$ts/types';
	import { createEventDispatcher, onMount } from 'svelte';
	import SimplifiedItemButton from './SimplifiedItemButton.svelte';
	import BottomNavContainer from './BottomNavContainer.svelte';

	const dispatch = createEventDispatcher();

	const testItems: InListItem[] = [
		{
			itemId: 1,
			itemAmount: 2,
			itemChecked: false,
			itemText: 'Test item 1'
		},
		{
			itemId: 2,
			itemAmount: 1,
			itemChecked: true,
			itemText: 'Test item 2'
		},
		{
			itemId: 3,
			itemAmount: 3,
			itemChecked: false,
			itemText: 'Test item 3'
		}
	];

	let input: HTMLInputElement;

	onMount(() => {
		input.focus();
	});
</script>

<div class="h-full bg-darkest flex flex-col">
	<input bind:this={input} type="text" class="h-20 px-8 w-full bg-darker outline-none text-xl" />

	<div class="flex flex-col px-3 gap-y-3 py-3 flex-grow">
		{#each testItems as item, index}
			<SimplifiedItemButton {item} highlight={index === 0} subtitle="3 already on list" />
		{/each}
	</div>

	<BottomNavContainer>
		<button on:click={() => dispatch('back-click')}>
			<Back />
		</button>

		<button>Add custom</button>
		<button>Add first</button>
	</BottomNavContainer>
</div>

<style>
	button {
		@apply bg-light rounded-lg active:brightness-90 duration-100 grid place-items-center flex-grow;
	}
</style>
