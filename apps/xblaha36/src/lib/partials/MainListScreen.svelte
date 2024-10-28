<script lang="ts">
	import { goto } from '$app/navigation';
	import Check from '$icons/check.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';
	import Undo from '$icons/undo.icon.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import ItemList from '$lib/ItemList.svelte';
	import QuantityChangeBar from '$lib/QuantityChangeBar.svelte';
	import { itemManager, listManager } from '$ts/stores';
	import type { InListItem } from 'backend';
	import { fade, fly, slide } from 'svelte/transition';

	export let showEdit = false;

	let titleValue = '';

	listManager?.selectedListDataStore.subscribe((data) => {
		titleValue = data?.listTitle ?? 'Untitled';
	});

	const _selectedListData = listManager?.selectedListDataStore;
	$: selectedListData = $_selectedListData;

	let highlightItem: InListItem | null;

	let showUndoDelete = false;

	function toggleCheckItem(itemId: number) {
		listManager?.toggleItemChecked(listManager!.selectedListId!, itemId);
		showUndoDelete = false;
	}

	export function toggleCheckHighlightedItem() {
		toggleCheckItem(highlightItem!.id);
	}
</script>

<div class="h-full flex flex-col duration-200 flex-grow">
	<input class="bg-darker text-2xl py-4 text-center outline-none" value={titleValue} />

	<ItemList
		on:item-click={(e) => toggleCheckItem(e.detail.item.id)}
		on:highlight-index={(e) => {
			listManager?.setListHighlightIndex(e.detail);
		}}
		on:edit-click={(e) => {
			highlightItem = e.detail.item;
			showEdit = true;
		}}
		on:delete-click={(e) => {
			listManager?.deleteItemFromList(listManager.selectedListId!, e.detail.item.id);
			showUndoDelete = true;
		}}
		items={selectedListData?.listItems}
		bind:highlightItem
	/>

	{#if showEdit}
		<QuantityChangeBar
			suggestedQuantities={itemManager.getSuggestedQuantities(highlightItem!.itemId)}
			plusClick={() => listManager.increaseItemAmountInSelected(highlightItem!.id)}
			minusClick={() => listManager.decreaseItemAmountInSelected(highlightItem!.id)}
			setQuantity={(amount, unit) =>
				listManager.setItemAmountInSelected(highlightItem!.id, amount, unit)}
		/>
	{/if}

	{#if listManager}
		{#key selectedListData}
			<!-- Delete checked off -->
			{#if listManager.lastDeletedItems.length > 0 && showUndoDelete}
				<button
					transition:fade
					on:click={() => listManager.undoDelete()}
					class="bg-light absolute bottom-28 translate-y-2 left-2 px-4 py-2 rounded-lg flex gap-x-2 pr-6"
				>
					<div class="rotate-90 scale-75">
						<Undo />
					</div>

					Undo delete
				</button>
			{:else if selectedListData?.listItems.some((item) => item.itemChecked)}
				<button
					transition:fade
					on:click={() => {
						listManager!.deleteAllCheckedItems(listManager!.selectedListId!);
						showUndoDelete = true;
					}}
					class="bg-light absolute bottom-28 translate-y-2 left-2 px-4 py-2 rounded-lg"
				>
					Delete checked-off
				</button>
			{/if}

			<!-- Plus button -->
			<button
				on:click={() => goto('add-items')}
				class="rounded-lg bg-light w-20 h-20 absolute right-2 bottom-28 shadow-xl grid place-items-center translate-y-2 active:brightness-90 duration-100"
			>
				<div class="scale-125">
					<Plus />
				</div>
			</button>
		{/key}
	{/if}
</div>

{#if showEdit}
	<div
		class="absolute bottom-0 inset-x-0 shadow-[0_0_12px] shadow-black/30"
		transition:fly={{ y: 200 }}
	>
		<BottomNavContainer>
			<button on:click={() => (showEdit = false)} class="col-span-3">
				<div class="flex gap-x-2 font-semibold">
					<div>Done</div>
					<!-- <Check /> -->
				</div>
			</button>
		</BottomNavContainer>
	</div>
{/if}
