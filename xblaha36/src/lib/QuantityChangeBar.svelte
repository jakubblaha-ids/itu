<script lang="ts">
	import Minus from '$icons/minus.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';
	import { listManager } from '$ts/stores';

	export let disabled = false;
	export let disableDecreaseButton = false;
	export let suggestedQuantities: { amount: number; unit: string }[];
</script>

<div class="bg-darker flex flex-col items-center">
	<div class="h-12 flex items-center">Quantity</div>

	<div id="large-btn-container" class="grid grid-cols-3 h-14 w-full px-2 gap-x-2">
		<button
			disabled={disableDecreaseButton || disabled}
			on:click={() => listManager?.decreaseAmountToAdd()}><Minus /></button
		>
		<button {disabled} on:click={() => listManager?.increaseAmountToAdd()}><Plus /></button>
		<button {disabled}>Other</button>
	</div>

	<div class="flex items-center px-2 gap-x-2 text-sm pt-2 w-full overflow-x-scroll no-scrollbar">
		{#each suggestedQuantities as q}
			<button
				{disabled}
				on:click={() => listManager?.setAmountToAdd(q.amount, q.unit)}
				class="min-w-12 bg-light grid place-items-center rounded px-4 flex-shrink-0 py-2"
			>
				{q.amount + q.unit}
			</button>
		{/each}
	</div>
</div>

<style>
	#large-btn-container > button {
		@apply grid place-items-center bg-light h-14 rounded-lg;
	}
</style>
