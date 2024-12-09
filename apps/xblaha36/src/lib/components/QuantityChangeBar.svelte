<!-- 
Jakub Blaha, xblaha36

Container with +/- buttons to edit item quantity and
a scrollable list of predefined amounts to choose from.
-->

<script lang="ts">
	import Minus from '$icons/minus.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';
	import { fade, slide } from 'svelte/transition';
	import TextPromptModal from '$lib/modals/TextPromptModal.svelte';
	import type { InListItem, ItemAmountUnit } from 'backend';

	interface Props {
		disabled?: boolean;
		suggestedQuantities: { amount: number; unit: ItemAmountUnit }[];
		inListItem: InListItem | null;
		showTitleBar?: boolean;
		plusClick: () => void;
		minusClick: () => void;
		setQuantity: (amount: number, unit: ItemAmountUnit) => void;
		setCustomAmount: (customAmount: string) => void;
	}

	let {
		disabled = false,
		suggestedQuantities,
		inListItem,
		showTitleBar = true,
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

	let scrollContainer: HTMLDivElement;
	let showLeftGradient = $state(false);
	let showRightGradient = $state(true);

	function handleScroll() {
		showLeftGradient = scrollContainer.scrollLeft > 0;
		showRightGradient =
			scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth;
	}
</script>

<div class="flex flex-col pb-3 z-30" transition:slide>
	{#if showTitleBar}
		<div class="text-gray-200 font-semibold rounded-t-lg py-2 pl-3 bg-darkest">Quantity</div>
	{/if}

	<!-- Minus and plus buttons -->
	<div id="large-btn-container" class="flex w-full px-2 gap-x-2 pt-2 justify-center h-16">
		<button
			class="bg-gradient-to-l from-light to-darker flex justify-end items-center px-8 disabled:opacity-10 rounded flex-grow"
			disabled={cannotDecrease || isCustomAmount || disabled}
			onclick={minusClick}
		>
			<Minus />
		</button>

		<button
			class="bg-gradient-to-r from-light to-darker flex justify-start items-center px-8 rounded flex-grow"
			disabled={isCustomAmount || disabled}
			onclick={plusClick}
		>
			<Plus />
		</button>
	</div>

	<!-- Scrollable container with predefined item amounts -->
	<div class="relative">
		<div
			id="shortcut-btn-container"
			bind:this={scrollContainer}
			onscroll={handleScroll}
			class="flex items-center px-2 gap-x-2 text-sm pt-3 w-full overflow-x-scroll no-scrollbar"
		>
			<button onclick={() => (showTextPromptModal = true)} {disabled}> Custom </button>

			{#each suggestedQuantities as q}
				<button
					{disabled}
					onclick={() => setQuantity(q.amount, q.unit)}
					class=""
					class:bg-lightest={inListItem &&
						inListItem.itemAmount === q.amount &&
						inListItem.itemUnit === q.unit}
				>
					{q.amount + q.unit}
				</button>
			{/each}
		</div>

		{#if showRightGradient}
			<div
				transition:fade={{ duration: 200 }}
				class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-darker to-transparent pointer-events-none"
			></div>
		{/if}

		{#if showLeftGradient}
			<div
				transition:fade={{ duration: 200 }}
				class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-darker to-transparent pointer-events-none"
			></div>
		{/if}
	</div>
</div>

<!-- Custom entity modal -->
{#if showTextPromptModal}
	<TextPromptModal
		placeholder="Enter custom quantity..."
		title="Enter custom quantity"
		onConfirm={(amount: string) => {
			showTextPromptModal = false;
			setCustomAmount(amount);
		}}
		goBack={() => (showTextPromptModal = false)}
	/>
{/if}

<style>
	#shortcut-btn-container > button {
		@apply min-w-20 bg-light grid place-items-center rounded-lg px-4 flex-shrink-0 py-4 font-medium;
	}
</style>
