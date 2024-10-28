<script lang="ts">
	import Minus from '$icons/minus.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';
	import { slide } from 'svelte/transition';
	import CustomQuantityModal from './CustomQuantityModal.svelte';

	interface Props {
		disabled?: boolean;
		disableDecreaseButton?: boolean;
		suggestedQuantities: { amount: number; unit: string }[];
		plusClick: () => void;
		minusClick: () => void;
		setQuantity: (amount: number, unit: string) => void;
		setCustomAmount: (customAmount: string) => void;
	}

	let {
		disabled = false,
		disableDecreaseButton = false,
		suggestedQuantities,
		plusClick,
		minusClick,
		setQuantity,
		setCustomAmount
	}: Props = $props();

	let showCustomQuantityModal = $state(false);
</script>

<div class="bg-darker flex flex-col items-center pb-3 z-30" transition:slide>
	<div class="h-12 flex items-center">Quantity</div>

	<div id="large-btn-container" class="grid grid-cols-3 h-14 w-full px-2 gap-x-2">
		<button disabled={disableDecreaseButton || disabled} onclick={minusClick}>
			<Minus />
		</button>

		<button {disabled} onclick={plusClick}>
			<Plus />
		</button>

		<button onclick={() => (showCustomQuantityModal = true)} {disabled}>Other</button>
	</div>

	<div class="flex items-center px-2 gap-x-2 text-sm pt-2 w-full overflow-x-scroll no-scrollbar">
		{#each suggestedQuantities as q}
			<button
				{disabled}
				onclick={() => setQuantity(q.amount, q.unit)}
				class="min-w-12 bg-light grid place-items-center rounded px-4 flex-shrink-0 py-2"
			>
				{q.amount + q.unit}
			</button>
		{/each}
	</div>
</div>

{#if showCustomQuantityModal}
	<CustomQuantityModal
		onConfirm={(amount) => {
			showCustomQuantityModal = false;
			setCustomAmount(amount);
		}}
	/>
{/if}

<style>
	#large-btn-container > button {
		@apply grid place-items-center bg-light h-14 rounded-lg;
	}
</style>
