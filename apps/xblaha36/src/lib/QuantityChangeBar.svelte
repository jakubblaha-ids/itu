<script lang="ts">
	import Minus from '$icons/minus.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';
	import { slide } from 'svelte/transition';
	import TextPromptModal from './TextPromptModal.svelte';
	import type { InListItem, ItemAmountUnit } from 'backend';

	interface Props {
		disabled?: boolean;
		suggestedQuantities: { amount: number; unit: ItemAmountUnit }[];
		inListItem: InListItem | null;
		plusClick: () => void;
		minusClick: () => void;
		setQuantity: (amount: number, unit: ItemAmountUnit) => void;
		setCustomAmount: (customAmount: string) => void;
	}

	let {
		disabled = false,
		suggestedQuantities,
		inListItem,
		plusClick,
		minusClick,
		setQuantity,
		setCustomAmount
	}: Props = $props();

	let showTextPromptModal = $state(false);

	let cannotDecrease = $derived(
		!inListItem || (typeof inListItem.itemAmount === 'number' && inListItem.itemAmount <= 1)
	);
	let isCustomAmount = $derived(inListItem && typeof inListItem.itemAmount === 'string');
</script>

<div class="bg-darker flex flex-col pb-3 z-30" transition:slide>
	<div class="text-gray-100 font-medium py-3 pl-3">Quantity</div>

	<div id="large-btn-container" class="grid grid-cols-3 h-14 w-full px-2 gap-x-2">
		<button disabled={cannotDecrease || isCustomAmount || disabled} onclick={minusClick}>
			<Minus />
		</button>

		<button disabled={isCustomAmount || disabled} onclick={plusClick}>
			<Plus />
		</button>

		<button onclick={() => (showTextPromptModal = true)} {disabled}>Other</button>
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

{#if showTextPromptModal}
	<TextPromptModal
		title="Enter custom quantity"
		onConfirm={(amount: string) => {
			showTextPromptModal = false;
			setCustomAmount(amount);
		}}
	/>
{/if}

<style>
	#large-btn-container > button {
		@apply grid place-items-center bg-light h-14 rounded-lg;
	}
</style>
