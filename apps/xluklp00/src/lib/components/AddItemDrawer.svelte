<!-- Author: Pavel Lukl, xluklp00 -->
<!-- Drawer for adding items to a list -->

<script lang="ts">
	import Check from "$icons/Check.svelte";
	import ChevronRight from "$icons/ChevronRight.svelte";
	import Cross from "$icons/Cross.svelte";
	import { itemManager, listManager } from "$lib/script";
	import type { DrawerState, ItemToAdd } from "$lib/script/drawer";
	import type { Item, ItemAmountUnit, RecentlyUsedItem } from "backend";
	import { flip } from "svelte/animate";
	import { fade, slide } from "svelte/transition";
	import UnitAmountInput from "./UnitAmountInput.svelte";
	import { onDestroy } from "svelte";
	import { activeModal } from "$lib/script/modal";
    
    let { onclose, drawerState = $bindable(), edit = $bindable() }: { onclose: CallableFunction, drawerState: DrawerState, edit: Boolean } = $props();

    const { selectedList } = listManager;
    let idsInList = $derived($selectedList?.listItems.map((i) => i.itemId) || []);
    let localDrawerState: DrawerState = $state(drawerState);

    $effect(() => {
        localDrawerState = drawerState;
    });

    onDestroy(() => {
        drawerState = localDrawerState;
    });

    // search phase
    let searchInputValue = $state('');

    function selectItem(item: ItemToAdd) {
        localDrawerState.itemToAdd = item;
        localDrawerState.phase = 'add';
    }

    $effect(() => {
        localDrawerState.availableItems = itemManager.getAvailableItems(searchInputValue);
        localDrawerState.recentlyUsedItems = itemManager.getRecentlyUsedItems();
    });

    // add phase
    const prefillAmounts = {
        "g": [300, 50],
        "ml": [500, 50],
        "pcs": [1, 1],
        "custom": [1, 1],
    }

    let defaultStep = $state(1);
    let customAmount = $state("");

    const units: ItemAmountUnit[] = ["g", "ml", "pcs", "custom"];

    function selectUnit(unit: ItemAmountUnit) {
        localDrawerState.selectedUnit = unit;
        localDrawerState.selectedAmount = prefillAmounts[unit][0];
        defaultStep = prefillAmounts[unit][1];
    }

    function cancelAdd() {
        localDrawerState = { phase: 'search', itemToAdd: null, availableItems: [], recentlyUsedItems: [], selectedAmount: 1, selectedUnit: "pcs" };
        edit = false;
    }

    async function addItem() {
        const { itemToAdd } = localDrawerState;
        if(!itemToAdd) return;

        if(localDrawerState.selectedUnit === 'custom') {
            localDrawerState.selectedAmount = customAmount;
        }

        const { selectedAmount, selectedUnit } = localDrawerState;
    
        const addedItem = listManager.addItemToList(itemToAdd.id, itemToAdd.id ? null : itemToAdd.name);
        listManager.setAmountToAdd(addedItem.id, selectedAmount, selectedUnit);

        await listManager.commitAddingItems();

        cancelAdd();

        if(!itemToAdd.id) return;
        itemManager.storeRecentlyUsedItem(itemToAdd.id, selectedAmount, selectedUnit);
        $activeModal = null;
    }

    async function addRecentItem(item: RecentlyUsedItem) {
        listManager.clearItemsToAdd();
        await listManager.addRecentlyUsedItemToAddedItems(item);
        await listManager.commitAddingItems();

        cancelAdd();
        $activeModal = null;
    }

    function editItem() {
        const { itemToAdd } = localDrawerState;
        if(!itemToAdd) return;

        if(localDrawerState.selectedUnit === 'custom') {
            localDrawerState.selectedAmount = customAmount;
        }

        const { selectedAmount, selectedUnit } = localDrawerState;

        if(!$selectedList || !itemToAdd.inListId) return;
        listManager.editItem($selectedList, itemToAdd.inListId, selectedAmount, selectedUnit);
        cancelAdd();
        $activeModal = null;
    }
</script>


<div class="fixed bottom-0 inset-x-0 rounded-t-xl bg-white h-[45%] border-t-2 border-gray py-4 px-4 z-40" transition:slide>
    {#if localDrawerState.phase === 'search'}
        <div in:fade class="flex flex-col gap-2 items-center h-full w-full">
            <div class="text-lg text-gray">Search or Enter a Name</div>
            <div class="flex justify-center items-center gap-4">
                <input bind:value={searchInputValue} type="text" class="w-full input" placeholder="Search" />
                <button onclick={() => selectItem({name: searchInputValue, id: null, inListId: null})} class="px-1 py-1 bg-blue text-white rounded-full button grid place-items-center">
                    <div class="w-9 h-9">
                        <Check></Check>
                    </div>
                </button>
            </div>

            {#if localDrawerState.recentlyUsedItems.length > 0}
                <div class="flex flex-col w-full">
                    <div class="text-gray">Recently Used</div>
                    <div class="flex gap-2 overflow-auto overflow-y-hidden w-full px-2 py-1">
                        {#each localDrawerState.recentlyUsedItems.filter((i) => !idsInList.includes(i.itemId)) as item (item.itemId)}
                            {@const itemName = itemManager.getNameOfitemId(item.itemId)}
                            <button onclick={() => addRecentItem(item)} class="rounded-3xl bg-gray text-white py-1 px-2 h-8 grid place-items-center button text-nowrap" animate:flip={{duration: 300}}>
                                {itemName} {item.amount} {item.unit === 'custom' ? '' : item.unit}
                            </button>
                        {/each}
                    </div>
                </div>    
            {/if}

            <div class="flex flex-wrap gap-2 overflow-auto w-full">
                {#each localDrawerState.availableItems as item (item.id)}
                    <button onclick={() => selectItem({...item, inListId: null})} class="rounded-3xl bg-gray text-white py-1 px-2 grid place-items-center button" animate:flip={{duration: 300}}>
                        {item.name}
                    </button>
                {/each}
            </div>
        </div>
    {:else if localDrawerState.phase === 'add'}
        <div in:fade class="flex flex-col gap-8 items-center h-full w-full">
            <div class="text-xl text-gray font-semibold">{localDrawerState.itemToAdd?.name}</div>
            <div class="flex items-center gap-2">
                {#each units as unit}
                    <button onclick={() => selectUnit(unit)} class="rounded-3xl w-20 bg-blue text-white py-1 px-2 grid place-items-center button transition-all {localDrawerState.selectedUnit === unit ? "border-gray border-2" : ""}">
                        {unit}
                    </button>
                {/each}
            </div>

            {#if localDrawerState.selectedUnit === 'custom'}
                <input bind:value={customAmount} in:fade type="text" class="input w-2/3" placeholder="3 teaspoons">
            {:else}
                <UnitAmountInput defaultStep={defaultStep} bind:value={localDrawerState.selectedAmount}></UnitAmountInput>
            {/if}

            <button onclick={() => edit ? editItem() : addItem()} class="w-2/3 h-10 bg-blue text-white rounded-3xl button grid place-items-center">
                <div class="w-8 h-8">
                    <Check></Check>
                </div>
            </button>
        </div>


        <button onclick={() => cancelAdd()} class="absolute bottom-4 left-4 bg-red text-white rounded-full w-14 h-14 grid place-items-center button">
            <div class="grid place-items-center">
                <div class="w-6 h-6 grid place-items-center">
                    <Cross></Cross>
                </div>
            </div>
        </button>
    {/if}

    <button onclick={() => onclose()} class="absolute bottom-4 right-4 bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
        <div class="grid place-items-center">
            <div class="w-9 h-9 translate-y-[2px] rotate-90">
                <ChevronRight></ChevronRight>
            </div>
        </div>
    </button>
</div>  
