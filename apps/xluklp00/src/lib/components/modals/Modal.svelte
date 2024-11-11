<script lang="ts">
	import Cross from "$icons/Cross.svelte";
import type { Snippet } from "svelte";
	import { fade, slide } from "svelte/transition";

    let { children, onClose}: {children?: Snippet, onClose: CallableFunction} = $props();

	function handleBackdropClick(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains("backdrop")) {
			onClose();
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div transition:fade={{duration: 300}} class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm backdrop z-50" onclick={handleBackdropClick}>

    <div transition:slide={{duration: 300}} class="bg-white p-10 rounded-lg mx-8 relative w-[95%]">
        <button class="absolute top-4 right-4 text-gray p-2" onclick={() => onClose()}>
            <Cross />
        </button>

        <div class="flex flex-col gap-4 items-center">
            {@render children?.()}       
        </div> 
    </div>
</div>    
