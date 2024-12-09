<!-- 
Jakub Blaha, xblaha36

Modal menu with added shared lists. Number of unchecked items
is displayed on each list button. List names that don't have any unchecked
items in them are crossed off.
-->

<script lang="ts">
	import type { List } from 'backend';
	import ShoppingListSideMenuItem from './ShoppingListSideMenuItem.svelte';
	import { listManager } from '$ts/global';

	interface Props {
		lists: List[];
		switchToListId: (listId: string) => void;
	}

	let props: Props = $props();

	const { availableListsStore, selectedListDataStore } = listManager;
</script>

<div class="h-full flex flex-col bg-darker">
	<div class="flex-grow"></div>

	<div class="rounded-t-xl bg-lighter flex flex-col py-2 shadow-lg min-h-48">
		{#each $availableListsStore as list}
			{@const unchecked = list.listItems.filter((i) => !i.itemChecked).length}

			<ShoppingListSideMenuItem
				title={list.listTitle}
				newItems={unchecked}
				active={list.id === $selectedListDataStore?.id}
				on:click={() => props.switchToListId(list.id)}
			/>
		{/each}
	</div>
</div>
