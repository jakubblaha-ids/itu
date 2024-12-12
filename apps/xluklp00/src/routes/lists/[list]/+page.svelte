<!-- Author: Pavel Lukl, xluklp00 -->
<!-- Displays list details -->

<script lang="ts">
	import ArrowDown from "$icons/ArrowDown.svelte";
	import Bin from "$icons/Bin.svelte";
	import Check from "$icons/Check.svelte";
	import ChevronRight from "$icons/ChevronRight.svelte";
    import Plus from "$icons/Plus.svelte";
	import AddItemDrawer from "$lib/components/AddItemDrawer.svelte";
	import ItemCard from "$lib/components/ItemCard.svelte";
	import { itemManager, listManager } from "$lib/script";
	import type { DrawerState } from "$lib/script/drawer";
	import { defaultListSortDir, defaultListSortType, listSortOptions, type ListSortDir, type ListSortType } from "$lib/script/listSort";
	import { activeModal } from "$lib/script/modal";
	import type { InListItem, List } from "backend";
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import { fade, fly, slide } from "svelte/transition";

    // get list data
    let { data }: { data: List } = $props();
    const { selectedList } = listManager;

    let localData = $state(data);

    let sortType: ListSortType = $state(defaultListSortType);
    let sortDirection: ListSortDir = $state(defaultListSortDir);

    function changeSortDir() {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
        listManager.sortSelectedList(sortType, sortDirection);
    }

    function changeSortType() {
        sortType = sortType === "alpha" ? "category" : "alpha";
        listManager.sortSelectedList(sortType, sortDirection);
    }

    let isEditingTitle = $state(false);
    let title = $state(data.listTitle);
    let titleInput: HTMLInputElement | null = $state(null);

    function clickTitle() {
        isEditingTitle = true;
        setTimeout(() => {
            titleInput?.focus();
        }, 100);
    }

    function confirmTitle() {
        isEditingTitle = false;
        listManager.setListTitle(localData.id, title);
    }

    function deleteChecked() {
        listManager.deleteAllCheckedItems(localData.id);
    }

    function onItemClick(id: number) {
        listManager.toggleItemChecked(localData.id, id);
    }

    function deleteItem(id: number) {
        listManager.deleteItemFromList(localData.id, id);
    }

    onMount(() => {
        listManager.setSelectedListId(localData.id);

        selectedList.subscribe((value) => {
            if(!value) return;
            localData = value;
        });
    })

    $effect(() => {
        localData = data;
    })

    // add item stuff
    let drawerState: DrawerState = $state({ phase: 'search', itemToAdd: null, availableItems: [], recentlyUsedItems: [], selectedAmount: 1, selectedUnit: "pcs" });

    function openAddItemDrawer() {
       $activeModal = "add-item";
    }

    function closeAddItemDrawer() {
        $activeModal = null;
    }

    // edit stuff
    let isEditing = $state(false);

    function editItem(item: InListItem) {
        isEditing = true;
        drawerState = { phase: 'add', itemToAdd: {id: item.itemId, name: item.customItemName || itemManager.getNameOfitemId(item.itemId!), inListId: item.id}, availableItems: [], recentlyUsedItems: [], selectedAmount: item.itemAmount, selectedUnit: item.itemUnit};
        $activeModal = "add-item";
    }
    
</script>

<div class="w-full h-full relative flex flex-col gap-4 pt-4 pb-12 px-4 items-center bg-white">
    <div class="flex flex-col items-start w-full">
        {#if isEditingTitle}
            <div class="flex items-center gap-4 w-full h-12" in:fade>
                <input class="input text-2xl" bind:value={title} bind:this={titleInput} />
                <button onclick={confirmTitle} class="bg-blue text-white rounded-full w-12 h-12 grid place-items-center button">
                    <div class="w-10 h-10 grid place-items-center">
                        <Check></Check>
                    </div>
                </button>
            </div>
        {:else}
            <button onclick={clickTitle} class='font-semibold text-2xl text-blue h-12' in:fade>{localData.listTitle}</button>
        {/if}
        <div class="text-gray">{localData.listItems.filter((item) => item.itemChecked).length} of {localData.listItems.length} items</div>
    </div>

    {#if localData.listItems.length > 1}
        <div class="flex items-center justify-between w-full flex-wrap gap-y-4" transition:fade>
            {#if localData.listItems.filter((item) => item.itemChecked).length > 0}
                <button onclick={deleteChecked} class="button bg-red text-white rounded-3xl py-2 px-4 text-lg" transition:fade>
                    <div class="flex items-center gap-2">
                        <div class="">Delete Checked</div>
                        <div class="w-4 h-4 grid place-items-center">
                            <Bin></Bin>
                        </div>
                    </div>
                </button>
            {/if}
            
            <div class="flex items-center gap-2 py-2 px-4 text-gray text-lg">
                <button onclick={changeSortDir} class="w-8 h-8 grid place-items-center transition-all duration-500 {sortDirection === "asc" ? "rotate-180" : ""}">
                    <ArrowDown></ArrowDown>
                </button>
                <button onclick={changeSortType} class="button-nshadow transition-all">{listSortOptions[sortType]}</button>
            </div>
        </div>
    {/if}

    {#if localData.listItems.length === 0}
        <div class="text-xl font-semibold text-gray mt-40">No Items in List</div>
        <button onclick={openAddItemDrawer} class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
            <div class="w-10 h-10 grid place-items-center">
                <Plus></Plus>
            </div>
        </button>
    {:else}
        <div class="w-full flex flex-col gap-4 overflow-y-auto transition-all" style="{$activeModal === 'add-item' ? "max-height: 170px;" : ""}">
            {#each localData.listItems as item (item.id)}
                <div class="w-full" animate:flip={{duration: 400}}>
                    <ItemCard {item} onclick={() => onItemClick(item.id)} onDeleteItem={() => deleteItem(item.id)} onEdit={() => editItem(item)}></ItemCard>
                </div>
            {/each}
        </div>
    {/if}
    
    {#if localData.listItems.length > 0}
        <div class="fixed bottom-4 flex items-center justify-between w-full z-20 px-4">
            <button onclick={() => $activeModal = 'menu'} class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
                <div class="grid place-items-center">
                    <div class="w-9 h-9 translate-x-[2px]">
                        <ChevronRight></ChevronRight>
                    </div>
                </div>
            </button>

            <button onclick={openAddItemDrawer} class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
                <div class="w-10 h-10 grid place-items-center">
                    <Plus></Plus>
                </div>
            </button>
        </div>
    {/if}

    {#if $activeModal === 'add-item'}
        <AddItemDrawer onclose={closeAddItemDrawer} bind:drawerState={drawerState} bind:edit={isEditing}></AddItemDrawer>
    {/if}
</div>