<script lang="ts">
	import Check from '$icons/check.icon.svelte';
	import Lists from '$icons/lists.icon.svelte';
	import Menu from '$icons/menu.icon.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import TextPromptModal from '$lib/TextPromptModal.svelte';
	import MainListScreen from '$lib/partials/MainListScreen.svelte';
	import SideListsMenu from '$lib/SideListsMenu.svelte';
	import SideMenu from '$lib/SideMenu.svelte';
	import { listManager, userManager } from '$ts/global';
	import { goto } from '$app/navigation';
	import ShareListModal from '$lib/modals/ShareListModal.svelte';
	import type { InListItem } from 'backend';
	import Cancel from '$icons/cancel.icon.svelte';

	let listsOpen = $state(false);
	let menuOpen = $state(false);

	let showEdit = $state(false);

	let showUsernameDrawer = $state(false);
	let showImportListModal = $state(false);
	let showShareListModal = $state(false);

	let { availableListsStore } = listManager;

	let highlightItem = $state<InListItem | null>(null);

	let mainListScreen = $state<any>();
</script>

<div class="w-full h-full flex flex-col duration-200" class:brightness-50={listsOpen || menuOpen}>
	<MainListScreen bind:this={mainListScreen} bind:highlightItem bind:showEdit />

	<BottomNavContainer>
		<button onclick={() => (menuOpen = true)}> <Menu /> </button>
		<button onclick={mainListScreen.toggleCheckHighlightedItem}>
			<div class="w-7">
				{#if highlightItem?.itemChecked}
					<Cancel />
				{:else}
					<Check />
				{/if}
			</div>
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
		onImport={() => {
			menuOpen = false;
			showImportListModal = true;
		}}
		closeMenu={() => (menuOpen = false)}
		onRemove={() => {
			listManager.removeListLocally(listManager.selectedListId!);
		}}
		onShare={() => {
			menuOpen = false;
			showShareListModal = true;
		}}
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
		goBack={() => (showUsernameDrawer = false)}
	/>
{/if}

{#if showImportListModal}
	<TextPromptModal
		title="Import a List"
		validator={(v) => {
			return parseInt(v) >= 1000 && parseInt(v) <= 9999;
		}}
		onConfirm={(value: string) => {
			goto(`/import-list?code=${value}`);
		}}
		goBack={() => (showImportListModal = false)}
		placeholder="----"
	></TextPromptModal>
{/if}

{#if showShareListModal}
	<ShareListModal close={() => (showShareListModal = false)} />
{/if}
