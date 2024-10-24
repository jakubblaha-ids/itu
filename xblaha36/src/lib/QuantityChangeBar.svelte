<script lang="ts">
	import Minus from '$icons/minus.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';

	const suggestedQuantities = ['1', '2', '3', '100g', '200g', '300g', '400g', '500g'];
</script>

<div class="bg-darker flex flex-col items-center">
	<div class="h-12 flex items-center">Quantity</div>

	<div id="large-btn-container" class="grid grid-cols-3 h-14 w-full px-2 gap-x-2">
		<button><Plus /></button>
		<button><Minus /></button>
		<button>Other</button>
	</div>

	<div class="flex items-center px-2 gap-x-2 text-sm pt-2 w-full overflow-x-scroll no-scrollbar">
		{#each suggestedQuantities as q}
			<button class="min-w-12 bg-light grid place-items-center rounded px-4 flex-shrink-0 py-2">
				{q}
			</button>
		{/each}
	</div>
</div>

<style>
	#large-btn-container > button {
		@apply grid place-items-center bg-light h-14 rounded-lg;
	}
</style>
