<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Check from '$icons/check.icon.svelte';
	import Lists from '$icons/lists.icon.svelte';
	import Menu from '$icons/menu.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import ItemList from '$lib/ItemList.svelte';
	import QuantityChangeBar from '$lib/QuantityChangeBar.svelte';
	import SideListsMenu from '$lib/SideListsMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import type { InListItem } from '$ts/types';

	let listsOpen = false;
	let menuOpen = false;

	$: contentTranslate = listsOpen ? -300 : menuOpen ? 300 : 0;

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

	function onListClick() {
		const url = $page.url;
		url.searchParams.set('listsOpen', listsOpen ? '0' : '1');
		goto(url);
		refreshMenusFromUrl();
	}

	function onMenuClick() {
		const url = $page.url;
		url.searchParams.set('menuOpen', menuOpen ? '0' : '1');
		goto(url);
		refreshMenusFromUrl();
	}

	function refreshMenusFromUrl() {
		const url = $page.url;

		listsOpen = url.searchParams.get('listsOpen') === '1';
		menuOpen = url.searchParams.get('menuOpen') === '1';
	}

	page.subscribe(() => {
		if (browser) {
			refreshMenusFromUrl();
		}
	});

	let showQuantityBar = false;
</script>

<div
	class="w-[80vw] h-full translate-x-20 absolute right-full top-0 duration-200"
	style="transform: translateX({contentTranslate}px);"
>
	<SideMenu />
</div>

<div class="h-full flex flex-col duration-200" style="transform: translateX({contentTranslate}px);">
	<div class="bg-darker text-2xl py-4 text-center">Title</div>

	<ItemList items={testItems} />

	{#if showQuantityBar}
		<QuantityChangeBar />
	{/if}

	<BottomNavContainer>
		<button on:click={onMenuClick}> <Menu /> </button>
		<button> <Check /> </button>
		<button on:click={onListClick}> <Lists /> </button>
	</BottomNavContainer>

	{#if !showQuantityBar}
		<!-- Delete checked off -->
		<button class="bg-light absolute bottom-28 translate-y-2 left-2 px-4 py-2 rounded-lg">
			Delete checked-off
		</button>

		<!-- Plus button -->
		<button
			on:click={() => goto('add-items')}
			class="rounded-lg bg-light w-20 h-20 absolute right-2 bottom-28 shadow-xl grid place-items-center translate-y-2 active:brightness-90 duration-100"
		>
			<div class="scale-125">
				<Plus />
			</div>
		</button>
	{/if}
</div>

<div
	class="w-[80vw] h-full translate-x-20 absolute left-full top-0 duration-200"
	style="transform: translateX({contentTranslate}px);"
>
	<SideListsMenu />
</div>
