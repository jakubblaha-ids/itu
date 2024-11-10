<script lang="ts">
    import type { List } from 'backend';
	import StringListItem from './StringListItem.svelte';
	import Bin from '$icons/Bin.svelte';
	import Clipboard from '$icons/Clipboard.svelte';
	import Duplicate from '$icons/Duplicate.svelte';
	import { listManager } from '$lib/script';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Check from '$icons/Check.svelte';

    let {list, onclick}: {list: List, onclick: CallableFunction} = $props();

    let card: HTMLDivElement | null = null;
    let deltaX = $state(0); // Tracks the current swipe distance
    const swipeMultiplier = 2; // Adjust this multiplier to control swipe speed
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    const resetDelay = 300; // Delay in ms to reset if panend doesn't fire

    let isCheckDisplayed = $state(false);

    function deleteList(e: Event) {
        e.stopPropagation();
        listManager.removeListLocally(list.id);
    }

    async function copyListCode(e: Event) {
        e.stopPropagation();
        await navigator.clipboard.writeText(list.code.toString());
        isCheckDisplayed = true;

        setTimeout(() => {
            isCheckDisplayed = false;
        }, 3000);
    }

    async function duplicateList(e: Event) {
        e.stopPropagation();
        await listManager.duplicateList(list);
    }

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
                        duplicateList(e.srcEvent);
                    } else {
                        deleteList(e.srcEvent);
                    }
                }
                resetCardPosition();
            }
        });

    });
</script>


<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div onclick={() => onclick()} class="bg-gray h-44 w-full p-4 rounded-2xl overflow-y-auto z-0 card !touch-pan-y flex gap-2" bind:this={card}>
    <!-- Left Indicator for Duplicate -->
    {#if deltaX > 0}
        <div class="grid place-items-center bg-blue text-white rounded-l-2xl" style="width: {Math.min(Math.abs(deltaX), 100)}px;" transition:fade={{duration: 100}}>
            {#if deltaX > 100}    
                <div class="h-6 w-6" transition:fade={{delay: 100, duration: 100}}>
                    <Duplicate />
                </div>
            {/if}
        </div>
    {/if}

    <div class="flex flex-col w-full h-full transition-all">
        <div class="flex flex-col gap-1">
            <div class="flex items-center flex-wrap gap-2">
                <div class="text-lg font-semibold text-white">
                    {list.listTitle}
                </div>

                <div class="flex-grow"></div>

                <button onclick={duplicateList} class='relative bg-blue grid place-items-center h-10 w-10 rounded-full text-white z-10 button'>
                    <div class="w-6 h-6 grid place-items-center">
                        <Duplicate></Duplicate>
                    </div>
                </button>

                {#if isCheckDisplayed}
                    <div class='relative bg-white grid place-items-center h-10 w-10 rounded-full z-10 text-blue' in:fade>
                        <div class="w-8 h-8 grid place-items-center">
                            <Check></Check>
                        </div>
                    </div>
                {:else}
                    <button onclick={copyListCode} class='relative bg-white grid place-items-center h-10 w-10 rounded-full z-10 button text-gray' in:fade>
                        <div class="w-5 h-5 grid place-items-center">
                            <Clipboard></Clipboard>
                        </div>
                    </button>
                {/if}

                <button onclick={deleteList} class='relative bg-red grid place-items-center h-10 w-10 rounded-full text-white z-10 button'>
                    <div class="w-5 h-5 grid place-items-center">
                        <Bin></Bin>
                    </div>
                </button>
            </div>
            <div class="text-white">{list.listItems.filter((item) => item.itemChecked).length} of {list.listItems.length} items</div>
        </div>

        <div class="flex flex-col overflow-hidden flex-grow mt-1">
            {#each list.listItems as item}
                <StringListItem {item} />
            {/each}
        </div>
    </div>

    {#if deltaX < 0}
        <div class="grid place-items-center bg-red text-white rounded-r-2xl" style="width: {Math.min(Math.abs(deltaX), 100)}px;" transition:fade={{duration: 100}}>
            {#if deltaX < -100}    
                <div class="h-6 w-6" transition:fade={{delay: 100, duration: 100}}>
                    <Bin />
                </div>
            {/if}
        </div>
    {/if}
</div>