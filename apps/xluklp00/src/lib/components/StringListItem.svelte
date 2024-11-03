<script lang="ts">
	import { itemManager } from "$lib/script";
	import type { InListItem } from "backend";

    let { item }: { item: InListItem} = $props();

    let name = $state('');
    if(item.itemId) {
        name = itemManager.getNameOfitemId(item.itemId);
    }
    
</script>

<div class="text-white">
    {#if name}
        <span>{name}</span>
    {/if}

    {#if item.itemAmount}
        <span>{item.itemAmount}</span>
    {/if}

    {#if item.itemUnit}
        <span>{item.itemUnit}</span>
    {/if}
</div>