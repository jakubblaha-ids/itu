<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Check from '$icons/check.icon.svelte';
	import Lists from '$icons/lists.icon.svelte';
	import Menu from '$icons/menu.icon.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import MainListScreen from '$lib/partials/MainListScreen.svelte';
	import SideListsMenu from '$lib/SideListsMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import { slide } from 'svelte/transition';

	let listsOpen = false;
	let menuOpen = false;

	$: contentTranslate = listsOpen ? -300 : menuOpen ? 300 : 0;

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

	let mainListScreen: MainListScreen;
	let showEdit = false;
</script>

<div
	class="w-[80vw] h-full translate-x-20 absolute right-full top-0 duration-200"
	style="transform: translateX({contentTranslate}px);"
>
	<SideMenu on:item-clicked={() => (menuOpen = false)} />
</div>

<div class="w-full h-full flex flex-col" style="transform: translateX({contentTranslate}px);">
	<MainListScreen bind:this={mainListScreen} bind:showEdit />

	<BottomNavContainer>
		<button on:click={onMenuClick}> <Menu /> </button>
		<button on:click={mainListScreen.toggleCheckHighlightedItem}>
			<Check />
		</button>
		<button on:click={onListClick}> <Lists /> </button>
	</BottomNavContainer>
</div>

<div
	class="w-[80vw] h-full translate-x-20 absolute left-full top-0 duration-200"
	style="transform: translateX({contentTranslate}px);"
>
	<SideListsMenu />
</div>
