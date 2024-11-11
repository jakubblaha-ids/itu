<script lang="ts">
	import type { InListItem } from "backend";
	import StringListItem from "./StringListItem.svelte";
	import { itemManager, userManager } from "$lib/script";
	import Check from "$icons/Check.svelte";

    let { item }: {item: InListItem} = $props();
    const { username } = userManager;

    let checkedBy = $state("");

    username.subscribe((value) => {
        if(value === item.itemCheckedByUsername) {
            checkedBy = "You";
        } else {
            checkedBy = item.itemCheckedByUsername;
        }
    });

    // TODO: fix unknown name and category, subscribe to itemManger?
</script>

<div class="relative flex items-center bg-gray w-full rounded-3xl h-20 {item.itemChecked ? "bg-opacity-50" : ""}">
    <div class="flex flex-col justify-center px-6">
        <StringListItem {item} aClass={"text-lg font-semibold"} />
        <span class='text-white text-sm'>{itemManager.getCategoryNameOfItemId(item.itemId)}</span>
    </div>

    <div class="flex-grow"></div>

    {#if item.itemChecked}
        <div class="grid place-items-center w-12 h-12 text-blue">
            <Check></Check>
        </div>

        <div class="bg-blue h-full rounded-r-3xl grid place-items-center min-w-32 max-w-32 ml-2 text-white overflow-hidden">
            <div class="truncate max-w-32 px-2">
                {checkedBy}
            </div>
        </div>
    {/if}
</div>