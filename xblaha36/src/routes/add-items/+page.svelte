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
	import type { InListItem } from '$ts/types';
	import { flip } from 'svelte/animate';
	import { expoOut } from 'svelte/easing';
	import { fly, slide } from 'svelte/transition';

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

	let showSearchModal = false;
</script>

<div class="flex flex-col h-full">
	<div class="bg-darker px-2 py-2">Will be added</div>

	<ItemList items={testItems} />

	<div class="bg-darker px-2 py-2">Recently used</div>

	<div class="grid px-3 gap-y-3 py-3 flex-grow overflow-scroll">
		{#each testItems as item}
			<SimplifiedItemButton {item} />
		{/each}
	</div>

	<QuantityChangeBar />

	<BottomNavContainer>
		<button on:click={() => goto('/')}> <Back /> </button>
		<button on:click={() => (showSearchModal = true)}> <Search /> </button>
		<button> <Check /> </button>
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
