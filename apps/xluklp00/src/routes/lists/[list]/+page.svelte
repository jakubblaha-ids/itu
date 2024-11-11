<script lang="ts">
	import { browser } from "$app/environment";
	import ChevronRight from "$icons/ChevronRight.svelte";
    import Plus from "$icons/Plus.svelte";
	import ItemCard from "$lib/components/ItemCard.svelte";
	import { listManager } from "$lib/script";
	import type { List } from "backend";
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";

    let { data }: { data: List } = $props();

    const { selectedList } = listManager;

    onMount(() => {
        listManager.setSelectedListId(data.id);

        selectedList.subscribe((value) => {
            if(!value) return;
            data = value;
        });
    })
</script>

    
<div class="w-full h-full relative flex flex-col gap-8 py-12 px-8 items-center">
    <div class="flex flex-col gap-2 w-full">
        <h1 class='font-semibold text-2xl text-gray'>{data.listTitle}</h1>
        <div class="text-gray">{data.listItems.filter((item) => item.itemChecked).length} of {data.listItems.length} items</div>
    </div>

    <div class="flex items-center justify-between w-full">
        <!-- TODO: -->
        <div>delete</div>
        <div>sort alpha</div>
    </div>

    <div class="w-full flex flex-col gap-4">
        {#each data.listItems as item (item.id)}
            <div class="w-full" animate:flip={{duration: 400}}>
                <ItemCard {item}></ItemCard>
            </div>
        {/each}
    </div>
    

    <div class="fixed bottom-4 flex items-center justify-between w-full z-20 px-4">
        <!-- TODO: open menu modal -->
        <button class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
            <div class="grid place-items-center">
                <div class="w-9 h-9 translate-x-[2px]">
                    <ChevronRight></ChevronRight>
                </div>
            </div>
        </button>

        <!-- TODO: open add item modal -->
        <button class="bg-blue text-white rounded-full w-14 h-14 grid place-items-center button">
            <div class="w-10 h-10 grid place-items-center">
                <Plus></Plus>
            </div>
        </button>
    </div>
</div>