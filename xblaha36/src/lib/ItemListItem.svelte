<script lang="ts">
	import Bin from '$icons/bin.icon.svelte';
	import Edit from '$icons/edit.icon.svelte';
	import type { InListItem } from '$ts/types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let item: InListItem;
	export let highlight = false;

	let showButton: null | 'delete' | 'edit' = null;

	const buttonWidth = 80;

	$: translateX = showButton === 'delete' ? buttonWidth : showButton === 'edit' ? -buttonWidth : 0;
	$: deleteButtonTranslateX = translateX - buttonWidth;
	$: editButtonTranslateX = translateX + buttonWidth;

	function onClick() {
		dispatch('item-click');

		if (showButton === null) {
			showButton = 'edit';
		} else if (showButton === 'edit') {
			showButton = 'delete';
		} else {
			showButton = null;
		}
	}
</script>

<div
	on:click={onClick}
	on:keypress={() => {}}
	role="button"
	tabindex="0"
	class="flex items-center rounded-lg h-14 bg-light overflow-hidden select-none relative duration-100"
	class:opacity-75={!highlight}
	class:highlight
>
	<button
		class="bg-[#9F3232] h-full grid place-items-center absolute left-0"
		style="width: {buttonWidth}px; transform: translateX({deleteButtonTranslateX}px);"
	>
		<Bin />
	</button>

	<div
		class="flex py-4 px-4 w-full flex-shrink-0 duration-100"
		style="transform: translateX({showButton === 'delete' ? translateX : 0}px);"
	>
		<div class="flex-grow">
			{item.itemId}
		</div>

		<div
			class="duration-100 px-2 flex items-center gap-x-4"
			style="transform: translateX({translateX}px);"
		>
			<div>
				{item.itemAmount}
			</div>

			<div class="">
				{#if item.itemCheckedByUserId || true}
					<div class="text-sm py-0.5 px-2 rounded-full bg-green-500">
						{item.itemCheckedByUserId || 'Eva'}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<button
		class="bg-lighter h-full grid place-items-center absolute right-0"
		style="width: {buttonWidth}px; transform: translateX({editButtonTranslateX}px);"
	>
		<Edit />
	</button>
</div>

<style>
	.highlight {
		@apply from-[#A88AC5] to-[#5F3487] bg-gradient-to-b h-20;
	}
</style>
