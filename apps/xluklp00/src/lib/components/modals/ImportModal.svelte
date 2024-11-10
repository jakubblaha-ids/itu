<script lang="ts">
	import { listManager } from "$lib/script";
	import { slide } from "svelte/transition";
	import Modal from "./Modal.svelte";
	import CodeInput from "../CodeInput.svelte";

    let { onClose }: {onClose: CallableFunction} = $props();

    let importCode: string = $state("");
    let isDisplayingImportError = $state(false);


    async function importList(importCode: string) {
        if(importCode.length !== 4) {
            return;
        }

        try {
            await listManager.importList(parseInt(importCode));
        } catch (e) {
            console.error(e);
            isDisplayingImportError = true;
            return;
        }

        importCode = "";
        onClose();
    }

    $effect(() => {
        importList(importCode);
        isDisplayingImportError = false;
    });
</script>

<Modal {onClose}>
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