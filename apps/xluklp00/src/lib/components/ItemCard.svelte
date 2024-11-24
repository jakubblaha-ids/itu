<script lang="ts">
	import type { InListItem } from "backend";
	import StringListItem from "./StringListItem.svelte";
	import { itemManager, listManager, userManager } from "$lib/script";
	import Check from "$icons/Check.svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import Bin from "$icons/Bin.svelte";
	import Edit from "$icons/Edit.svelte";

    let { item, onclick, onDeleteItem, onEdit }: {item: InListItem, onclick: CallableFunction, onDeleteItem: CallableFunction, onEdit: CallableFunction} = $props();
    const { username } = userManager;

    let checkedBy = $state("");

    function updateCheckedBy(username: string | null, itemCheckedByUsername: string) {
        if(username && username === itemCheckedByUsername) {
            checkedBy = "You";
        } else {
            checkedBy = itemCheckedByUsername;
        }

    }

    $effect(() => {
        updateCheckedBy($username, item.itemCheckedByUsername);
    });

    function deleteItem() {
        onDeleteItem();
    }

    function editItem() {
        onEdit();
    }

    // swipe
    let card: HTMLButtonElement | null = null;
    let deltaX = $state(0); // Tracks the current swipe distance
    const swipeMultiplier = 2; // Adjust this multiplier to control swipe speed
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const resetDelay = 300; // Delay in ms to reset if panend doesn't fire
    const swipeThreshold = 112;

    // Function to reset card position and clear tracking values
    function resetCardPosition() {
        deltaX = 0;
        if (resetTimer) {
            clearTimeout(resetTimer);
            resetTimer = null;
        }
    }


    onMount(async () => {
        if (!card || !window) return;

        const Hammer = (await import('hammerjs')).default;
        let manager = new Hammer.Manager(card);
        let pan = new Hammer.Pan({ threshold: 0 });
        manager.add(pan);

        let isSwipeAllowed = true; // Allow swipe by default

        manager.on('pan', function (e) {
            isSwipeAllowed = Math.abs(e.deltaY) < Math.abs(e.deltaX);

            if (isSwipeAllowed) {
                e.preventDefault();

                // Update deltaX for tracking total swipe distance
                deltaX = e.deltaX * swipeMultiplier;

                // Clear and reset the timer
                if (resetTimer) clearTimeout(resetTimer);
                resetTimer = setTimeout(() => {
                    resetCardPosition();
                }, resetDelay);
            }
        });

        manager.on('panend', function (e) {
            if (isSwipeAllowed) {
                if (Math.abs(deltaX) > 100) {
                    if (deltaX > 0) {
                        editItem();
                    } else {
                        deleteItem();
                    }
                }
                resetCardPosition();
            }
        });

    });
</script>

<button onclick={() => onclick()} class="relative flex items-center bg-gray w-full rounded-3xl h-20 !touch-pan-y {item.itemChecked ? "bg-opacity-50" : ""}" bind:this={card}>

    {#if deltaX > 0}
        <div class="grid place-items-center bg-blue text-white rounded-l-2xl absolute left-0 h-full" style="width: {Math.min(Math.abs(deltaX), swipeThreshold)}px;" transition:fade={{duration: 100}}>
            {#if deltaX > swipeThreshold}    
                <div class="h-6 w-6" transition:fade={{delay: 100, duration: 100}}>
                    <Edit></Edit>
                </div>
            {/if}
        </div>
    {/if}

    <div class="flex flex-col justify-center items-start px-6">
        <StringListItem {item} aClass={"text-lg font-semibold"} />
        <span class='text-white text-sm'>{itemManager.getCategoryNameOfItemId(item.itemId)}</span>
    </div>

    <div class="flex-grow"></div>


    {#if item.itemChecked}
        <div class="grid place-items-center w-12 h-12 text-blue">
            <Check></Check>
        </div>

        <div class="bg-blue h-full rounded-r-3xl grid place-items-center min-w-28 max-w-28 ml-2 text-white overflow-hidden">
            <div class="truncate max-w-28 px-2">
                {checkedBy}
            </div>
        </div>
    {/if}

    {#if deltaX < 0}
        <div class="grid place-items-center bg-red text-white rounded-r-2xl absolute right-0 h-full" style="width: {Math.min(Math.abs(deltaX), swipeThreshold)}px;" transition:fade={{duration: 100}}>
            {#if deltaX < -swipeThreshold}    
                <div class="h-6 w-6" transition:fade={{delay: 100, duration: 100}}>
                    <Bin />
                </div>
            {/if}
        </div>
    {/if}
</button>