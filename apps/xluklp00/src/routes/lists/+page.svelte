<script lang="ts">
	import ArrowUp from '$icons/ArrowUp.svelte';
    import Plus from '$icons/Plus.svelte';
	import CodeInput from '$lib/components/CodeInput.svelte';
    import ListCard from '$lib/components/ListCard.svelte';
	import Modal from '$lib/components/Modal.svelte';
    import { listManager } from '$lib/script';
	import type { List } from 'backend';
    import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

    const { lists } = listManager;

    let openModal: 'import' | null = $state(null);
    let importCode: string = $state("");
    let isDisplayingImportError = $state(false);
    

    onMount(async () => {
        lists.subscribe(console.log);
        await listManager.refreshAvailableLists();
    });

    async function importList(importCode: string) {
        if(importCode.length !== 4) {
            return;
        }

        console.log("importing list with code", importCode);

        try {
            await listManager.importList(parseInt(importCode));
        } catch (e) {
            console.error(e);
            isDisplayingImportError = true;
            return;
        }

        // TODO: list already added error

        importCode = "";
        openModal = null;
    }

    $effect(() => {
        importList(importCode);
        isDisplayingImportError = false;
    });
</script>

<div class="absolute inset-0">
    <Modal isOpen={openModal === 'import'}>
        <div class='text-gray text-lg'>Import a list with a code</div>
        <CodeInput bind:code={importCode}></CodeInput>
        <div class="text-red text-sm h-6">
            {#if isDisplayingImportError}
                <div transition:slide={{ duration: 400}}>
                    Could not find a list with that code
                </div>
            {/if}
        </div>
    </Modal>
        

    <div class="mx-4 my-12">
        <div class="flex flex-col gap-8 overflow-y-auto">
            {#each $lists as list}
                <ListCard {list} />
            {/each}
        </div>
    </div>

    <div class="absolute bottom-4 right-4 flex items-center justify-end w-full gap-x-6">

        <button onclick={() => openModal = openModal === 'import' ? null : 'import'} class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center">
            <ArrowUp></ArrowUp>
        </button>
        <button class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center">
            <!-- TODO: open new list -->
            <Plus></Plus>
        </button>
    </div>
</div>  