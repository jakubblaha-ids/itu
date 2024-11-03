<script lang="ts">
    import type { List } from 'backend';
	import StringListItem from './StringListItem.svelte';

    let {list, ..._}: {list: List;} = $props();
</script>


<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div onclick={() => console.log("TODO")} class="bg-gray h-36 w-full p-4 rounded-2xl flex flex-col">
    <div class="flex flex-col gap-1">
        <div class="text-lg font-semibold text-white">
            {list.listTitle}
        </div>
        <div class="text-white">{list.listItems.length} items</div>
    </div>

    <div class="flex flex-col overflow-y-auto flex-grow mt-2">
        {#each list.listItems as item}
            <StringListItem {item} />
        {/each}
    </div>
</div>