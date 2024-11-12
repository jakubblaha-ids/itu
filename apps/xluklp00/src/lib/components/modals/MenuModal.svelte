<script lang="ts">
	import { goto } from "$app/navigation";
	import Bin from "$icons/Bin.svelte";
    import ChevronLeft from "$icons/ChevronLeft.svelte";
	import Clipboard from "$icons/Clipboard.svelte";
	import Duplicate from "$icons/Duplicate.svelte";
	import Plus from "$icons/Plus.svelte";
	import { listManager } from "$lib/script";
    import { activeModal } from "$lib/script/modal";
	import { slide } from "svelte/transition";

    let { onClose}: {onClose: CallableFunction} = $props();

    let { selectedList } = listManager;

	function handleBackdropClick(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains("backdrop")) {
			onClose();
		}
	}

    function handleDeleteChecked() {
        if(!$selectedList) return;
        listManager.deleteAllCheckedItems($selectedList.id);
        $activeModal = null;
    }

    function handleDeleteList() {
        if(!$selectedList) return;
        listManager.removeListLocally($selectedList.id);
        goto(`/lists`);
        $activeModal = null;
    }

    async function handleCopyListCode() {
        if(!$selectedList) return;
        await navigator.clipboard.writeText($selectedList.code.toString());
        $activeModal = null;
    }

    function handleDuplicateList() {
        if(!$selectedList) return;
        listManager.duplicateList($selectedList);
        goto(`/lists`);
        $activeModal = null;
    }

    function handleAddItem() {
        // TODO
        console.log("add item");
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div transition:slide={{duration: 150, axis: 'x'}} class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm backdrop z-50" onclick={handleBackdropClick}>

    <div class="bg-white rounded-r-lg relative h-full w-[60%] flex flex-col items-center justify-end pb-24">
        {#if $selectedList && $selectedList.listItems.filter((i) => i.itemChecked).length > 0}
            <button onclick={handleDeleteChecked} class="button flex items-center justify-center gap-4 py-4 px-4 w-full text-red">
                <div class="text-lg">Delete Checked</div>
                <div class="grid place-items-center w-5 h-5">
                    <Bin></Bin>
                </div>
            </button>
        {/if}

        <button onclick={handleDeleteList} class="button flex items-center justify-center gap-4 py-4 px-4 w-full text-red">
            <div class="text-lg">Delete List</div>
            <div class="grid place-items-center w-5 h-5">
                <Bin></Bin>
            </div>
        </button>

        <button onclick={handleCopyListCode} class="button flex items-center justify-center gap-4 py-4 px-4 w-full text-gray">
            <div class="text-lg">Copy List Code</div>
            <div class="grid place-items-center w-5 h-5">
                <Clipboard></Clipboard>
            </div>
        </button>

        <button onclick={handleDuplicateList} class="button flex items-center justify-center gap-4 py-4 px-4 w-full text-blue">
            <div class="text-lg">Duplicate List</div>
            <div class="grid place-items-center w-6 h-6">
                <Duplicate></Duplicate>
            </div>
        </button>

        <button onclick={handleAddItem} class="button flex items-center justify-center gap-4 py-4 px-4 w-full text-blue">
            <div class="text-lg">Add Item</div>
            <div class="grid place-items-center w-5 h-5">
                <Plus></Plus>
            </div>
        </button>

        <button onclick={() => $activeModal = null} class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button absolute bottom-4 left-4">
            <div class="grid place-items-center">
                <div class="w-9 h-9 -translate-x-[2px]">
                    <ChevronLeft></ChevronLeft>
                </div>
            </div>
        </button>
    </div>
</div>    
