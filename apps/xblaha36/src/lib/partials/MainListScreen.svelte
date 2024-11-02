<script lang="ts">
	import Plus from '$icons/plus.icon.svelte';
	import Undo from '$icons/undo.icon.svelte';
	import AddItemScreen from '$lib/partials/AddItemScreen.svelte';
	import BottomNavContainer from '$lib/BottomNavContainer.svelte';
	import ItemList from '$lib/ItemList.svelte';
	import Modal from '$lib/Modal.svelte';
	import QuantityChangeBar from '$lib/QuantityChangeBar.svelte';
	import { itemManager, listManager } from '$ts/stores';
	import type { InListItem } from 'backend';
	import { fly } from 'svelte/transition';
	import ItemListItem from '$lib/ItemListItem.svelte';
	import FloatingButton from '$lib/components/FloatingButton.svelte';
	import FloatingLeftButton from '$lib/components/FloatingLeftButton.svelte';

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

	let showAddItemModal = false;
</script>

<div class="h-full flex flex-col duration-200 flex-grow overflow-hidden">
	<input
		class="bg-darker text-2xl py-4 text-center outline-none"
		bind:value={titleValue}
		on:change={() => {
			listManager?.setListTitle(listManager.selectedListId!, titleValue);
		}}
	/>

	<ItemList
		on:highlight-index={(e) => {
			listManager?.setListHighlightIndex(e.detail);
		}}
		items={selectedListData?.listItems}
		bind:highlightItem
		isItemInBottomSection={(item) => item?.itemChecked}
		bottomSectionTitle="Checked off"
	>
		{#snippet itemRenderer(item, highlight: boolean, scrollToItem: () => void)}
			<ItemListItem
				{item}
				on:click={() => toggleCheckItem(item.id)}
				on:edit-click={(e) => {
					scrollToItem();

					highlightItem = item;
					showEdit = true;
				}}
				on:delete-click={(e) => {
					listManager?.deleteItemFromList(listManager.selectedListId!, e.detail.item.id);
					showUndoDelete = true;
				}}
				{highlight}
				checked={item.itemChecked}
			/>
		{/snippet}
	</ItemList>

	{#if showEdit}
		<div class="bg-darker z-30">
			<QuantityChangeBar
				showTitleBar={false}
				inListItem={highlightItem!}
				suggestedQuantities={itemManager.getSuggestedQuantities(highlightItem!.itemId)}
				plusClick={() => listManager.increaseItemAmountInSelected(highlightItem!.id)}
				minusClick={() => listManager.decreaseItemAmountInSelected(highlightItem!.id)}
				setQuantity={(amount, unit) =>
					listManager.setItemAmountInSelected(highlightItem!.id, amount, unit)}
				setCustomAmount={(customAmount) =>
					listManager.setItemAmountInSelected(highlightItem!.id, customAmount, 'custom')}
			/>
		</div>
	{/if}

	{#if listManager}
		{#key selectedListData}
			<!-- Delete checked off -->
			{#if listManager.lastDeletedItems.length > 0 && showUndoDelete}
				<FloatingLeftButton
					text="Undo delete"
					icon={Undo}
					onclick={() => listManager.undoDelete()}
				/>
			{:else if selectedListData?.listItems.some((item) => item.itemChecked)}
				<FloatingLeftButton
					text="Delete checked-off"
					onclick={() => {
						listManager!.deleteAllCheckedItems(listManager!.selectedListId!);
						showUndoDelete = true;
					}}
				/>
			{/if}

			<FloatingButton onclick={() => (showAddItemModal = true)}>
				<Plus />
			</FloatingButton>
		{/key}
	{/if}
</div>

{#if showEdit}
	<div
		class="absolute bottom-0 inset-x-0 shadow-[0_0_12px] shadow-black/30 z-40"
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

{#if showAddItemModal}
	<Modal title="Add an Item">
		<AddItemScreen goBack={() => (showAddItemModal = false)} />
	</Modal>
{/if}
