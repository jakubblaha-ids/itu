<script lang="ts">
	import { itemManager } from "$lib/script";
	import type { InListItem } from "backend";

    let { item, aClass }: { item: InListItem, aClass?: string} = $props();
</script>

<div class="text-white {aClass}">
    {#if item.itemUnit === "custom"}
        <span>{item.customItemName || itemManager.getNameOfitemId(item.itemId!)}</span>
        <span>{item.itemAmount}</span>
    {:else}
        <span>{item.customItemName || itemManager.getNameOfitemId(item.itemId!)}</span>
        {#if item.itemAmount}
            <span>{item.itemAmount}</span>
        {/if}

        {#if item.itemUnit}
            <span>{item.itemUnit}</span>
        {/if}
    {/if}
</div>  