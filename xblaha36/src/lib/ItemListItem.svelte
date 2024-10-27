<script lang="ts">
	import Bin from '$icons/bin.icon.svelte';
	import Edit from '$icons/edit.icon.svelte';
	import { itemManager } from '$ts/stores';
	import type { InListItem } from '$ts/types';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let item: InListItem;
	export let highlight = false;
	export let checked;

	let showButton: null | 'delete' | 'edit' = null;

	const buttonWidth = 80;

	$: translateX = showButton === 'delete' ? buttonWidth : showButton === 'edit' ? -buttonWidth : 0;
	$: deleteButtonTranslateX = translateX - buttonWidth;
	$: editButtonTranslateX = translateX + buttonWidth;

	function onClick() {
		dispatch('click');
	}

	let container: HTMLDivElement;

	onMount(async () => {
		const Hammer = (await import('hammerjs')).default;

		const hammer = new Hammer(container);

		hammer.on('swipeleft', () => {
			if (showButton === 'edit') {
				return;
			} else if (showButton === 'delete') {
				showButton = null;
			} else if (showButton === null) {
				showButton = 'edit';
			}
		});

		hammer.on('swiperight', () => {
			if (showButton === 'delete') {
				return;
			} else if (showButton === 'edit') {
				showButton = null;
			} else if (showButton === null) {
				showButton = 'delete';
			}
		});
	});

	function resetShowButton() {
		showButton = null;
	}
</script>

<div
	bind:this={container}
	on:click={onClick}
	on:keypress={() => {}}
	role="button"
	tabindex="0"
	class="flex items-center rounded-lg h-14 from-light transition-all to-light bg-gradient-to-b overflow-hidden select-none relative duration-300 pointer-events-auto flex-shrink-0"
	class:opacity-75={!highlight}
	class:!opacity-50={checked && !highlight}
	class:highlight
>
	<button
		on:click={() => dispatch('delete-click')}
		class="bg-[#9F3232] h-full grid place-items-center absolute left-0"
		style="width: {buttonWidth}px; transform: translateX({deleteButtonTranslateX}px);"
	>
		<Bin />
	</button>

	<div class="flex py-4 px-4 w-full flex-shrink-0">
		<div
			class="flex-grow duration-100"
			style="transform: translateX({showButton === 'delete' ? translateX : 0}px);"
		>
			{item.customItemName || itemManager?.getNameOfitemId(item.itemId!)}
		</div>

		<div
			class="duration-100 px-2 flex items-center gap-x-4"
			style="transform: translateX({showButton === 'edit' ? translateX : 0}px);"
		>
			<div>
				{item.itemAmount + item.itemUnit}
			</div>

			<div class="">
				{#if item.itemCheckedByUserId || true}
					<div class="text-sm py-0.5 px-2 rounded-full bg-green-500">
						{item.itemCheckedByUserId || 'Eva'}
					</div>
				{/if}
			</div>
		</div>

		<div class="flex flex-col justify-center absolute inset-0 w-full pl-2.5 pr-[4.5rem]">
			<div
				class="h-0.5 bg-white w-0 duration-100 translate-y-px rounded-full opacity-50"
				class:!w-full={checked}
			></div>
		</div>
		<!-- <div class="text-xl absolute left-0">✓</div> -->
	</div>

	<button
		on:click={() => dispatch('edit-click', { resetShowButton })}
		class="bg-lighter h-full grid place-items-center absolute right-0"
		style="width: {buttonWidth}px; transform: translateX({editButtonTranslateX}px);"
	>
		<Edit />
	</button>
</div>

<style>
	.highlight {
		@apply from-[#A88AC5] to-[#5F3487] h-20;
	}
</style>
