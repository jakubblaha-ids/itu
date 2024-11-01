<script lang="ts">
	import Check from '$icons/check.icon.svelte';
	import Lists from '$icons/lists.icon.svelte';
	import Menu from '$icons/menu.icon.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import TextPromptModal from '$lib/TextPromptModal.svelte';
	import MainListScreen from '$lib/partials/MainListScreen.svelte';
	import SideListsMenu from '$lib/SideListsMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import { listManager, userManager } from '$ts/stores';

	let listsOpen = $state(false);
	let menuOpen = $state(false);

	let mainListScreen: MainListScreen | null = $state(null);
	let showEdit = $state(false);

	let showUsernameDrawer = $state(false);

	let { availableListsStore } = listManager;
</script>

<div class="w-full h-full flex flex-col duration-200" class:brightness-50={listsOpen || menuOpen}>
	<MainListScreen bind:this={mainListScreen} bind:showEdit />

	<BottomNavContainer>
		<button onclick={() => (menuOpen = true)}> <Menu /> </button>
		<button onclick={mainListScreen.toggleCheckHighlightedItem}>
			<Check />
		</button>
		<button onclick={() => (listsOpen = true)}> <Lists /> </button>
	</BottomNavContainer>

	{#if listsOpen || menuOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={() => {
				listsOpen = false;
				menuOpen = false;
			}}
			class="absolute inset-0 bg-black/50 z-50"
		></div>
	{/if}
</div>

<div
	class="w-[75vw] h-full translate-x-20 absolute right-full top-0 duration-200"
	style="transform: translateX({menuOpen ? 100 : 0}%);"
>
	<SideMenu
		onChangeUsernameClick={() => {
			menuOpen = false;
			showUsernameDrawer = true;
		}}
		closeMenu={() => (menuOpen = false)}
	/>
</div>

<div
	class="w-[75vw] h-full translate-x-20 absolute left-full top-0 duration-200"
	style="transform: translateX({listsOpen ? -100 : 0}%);"
>
	<SideListsMenu
		lists={$availableListsStore}
		switchToListId={(id: string) => {
			listManager.setSelectedListId(id);
			listsOpen = false;
		}}
	/>
</div>

{#if showUsernameDrawer}
	<TextPromptModal
		title="Change username"
		onConfirm={(username: string) => {
			userManager.setUsername(username);
			showUsernameDrawer = false;
		}}
	/>
{/if}
