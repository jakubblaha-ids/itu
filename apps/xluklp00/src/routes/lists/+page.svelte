<script lang="ts">
	import ArrowUp from '$icons/ArrowUp.svelte';
    import Plus from '$icons/Plus.svelte';
    import ListCard from '$lib/components/ListCard.svelte';
    import { activeModal, listManager } from '$lib/script';
    import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

    const { lists } = listManager;

    onMount(async () => {
        await listManager.refreshAvailableLists();
    });
</script>

{#if $lists.length === 0}
    <div class="h-full flex flex-col items-center justify-center gap-4" in:fade>
        <div class="text-2xl font-semibold text-gray">No lists available</div>
        <div class="text-lg text-gray">Create a new list or import one</div>
        <div class="flex gap-4">
            <button onclick={() => $activeModal = 'import'} class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
                <ArrowUp></ArrowUp>
            </button>

            <!-- TODO: open new list -->
            <button class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
                <Plus></Plus>
            </button>
        </div>
    </div>
{:else}
    <div class="" in:fade>
        <div class="px-4 pt-12 pb-24">
            <div class="flex flex-col gap-8 overflow-y-auto overflow-x-hidden">
                {#each $lists as list (list.id)}
                    <div class="" animate:flip={{duration: 400}} >
                        <ListCard onclick={() => console.log("TODO")} {list} />
                    </div>
                {/each}
            </div>
        </div>

        <div class="fixed bottom-4 right-4 flex items-center justify-end w-full gap-x-6 z-20">
            <button onclick={() => $activeModal = 'import'} class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
                <ArrowUp></ArrowUp>
            </button>

            <!-- TODO: open new list -->
            <button class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
                <Plus></Plus>
            </button>
        </div>
    </div>    
{/if}
 