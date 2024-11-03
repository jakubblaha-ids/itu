<script lang="ts">
    import type { List } from 'backend';
	import StringListItem from './StringListItem.svelte';
	import Bin from '$icons/Bin.svelte';
	import Clipboard from '$icons/Clipboard.svelte';
	import Duplicate from '$icons/Duplicate.svelte';
	import { listManager } from '$lib/script';

    let {list, ..._}: {list: List;} = $props();

    function deleteList() {
        listManager.removeListLocally(list.id);
    }

    async function copyListCode() {
        await navigator.clipboard.writeText(list.code.toString());
    }

    async function duplicateList() {
        await listManager.createList();
        if(listManager.selectedListId === null) {
            return;
        }
        await listManager.setListData(listManager.selectedListId, list);
    }
</script>


<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div onclick={() => console.log("TODO")} class="bg-gray h-36 w-full p-4 rounded-2xl flex flex-col overflow-y-auto z-0">
    <div class="flex flex-col gap-1">
        <div class="flex items-center flex-wrap gap-2">
            <div class="text-lg font-semibold text-white">
                {list.listTitle}
            </div>

            <div class="flex-grow"></div>

            <button onclick={duplicateList} class='relative bg-blue grid place-items-center h-10 w-10 rounded-full text-white z-10'>
                <div class="absolute w-6 h-6 grid place-items-center">
                    <Duplicate></Duplicate>
                </div>
            </button>

            <button onclick={copyListCode} class='relative bg-white grid place-items-center h-10 w-10 rounded-full text-gray z-10'>
                <div class="absolute w-5 h-5 grid place-items-center">
                    <Clipboard></Clipboard>
                </div>
            </button>

            <button onclick={deleteList} class='relative bg-red grid place-items-center h-10 w-10 rounded-full text-white z-10'>
                <div class="absolute w-5 h-5 grid place-items-center">
                    <Bin></Bin>
                </div>
            </button>
        </div>
        <div class="text-white">{list.listItems.length} items</div>
    </div>

    <div class="flex flex-col overflow-y-auto flex-grow mt-2">
        {#each list.listItems as item}
            <StringListItem {item} />
        {/each}
    </div>
</div>