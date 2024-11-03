<script lang="ts">
	import Cross from "$icons/Cross.svelte";
import type { Snippet } from "svelte";

    let { children, isOpen = $bindable() }: {children?: Snippet, isOpen: boolean} = $props();

	function handleBackdropClick(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains("backdrop")) {
			isOpen = false;
		}
	}
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm backdrop" onclick={handleBackdropClick}>

        <div class="bg-white p-10 rounded-lg mx-8 relative w-[95%]">
            <button class="absolute top-4 right-4 text-gray p-2" onclick={() => isOpen = false}>
                <Cross />
            </button>

            <div class="flex flex-col gap-4 items-center">
                {@render children?.()}       
            </div> 
        </div>
    </div>    
{/if}
