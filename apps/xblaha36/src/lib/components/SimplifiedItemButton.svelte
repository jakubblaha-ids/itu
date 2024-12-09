<!-- 
Jakub Blaha, xblaha36

An item button to be displayed in the result list while searching
for an item.
-->

<script lang="ts">
	import Back from '$icons/back.icon.svelte';
	import type { Item } from 'backend';

	export let item: Item;
	export let highlight = false;
	export let subtitle = '';
</script>

<button
	on:click
	class="flex items-center rounded-lg h-[4.5rem] bg-light overflow-hidden select-none relative flex-shrink-0 text-left w-full duration-300 pointer-events-auto"
	class:highlight
>
	<div class="flex py-4 px-4 w-full flex-shrink-0 duration-100 items-center">
		<div class="flex-grow flex-col">
			<div class="font-medium">
				{item.name}
			</div>

			{#if subtitle}
				<div class="text-xs opacity-80">
					{subtitle}
				</div>
			{/if}
		</div>

		<div class:opacity-0={!highlight} class="duration-200">
			<Back />
		</div>
	</div>
</button>

<style>
	.highlight {
		@apply bg-gradient-to-b from-[#A88AC5] to-[#5F3487] h-24 text-lg;
	}
</style>
