<script lang="ts">
	import Back from '$icons/back.icon.svelte';
	import type { InListItem } from '$ts/types';

	export let item: InListItem;
	export let highlight = false;
	export let subtitle = '';
</script>

<div
	on:click
	on:keypress={() => {}}
	role="button"
	tabindex="0"
	class="flex items-center rounded-lg h-20 bg-light overflow-hidden select-none relative duration-100"
>
	<div class="flex py-4 px-4 w-full flex-shrink-0 duration-100 items-center">
		<div class="flex-grow flex-col">
			<div>
				{item.itemId}
			</div>

			<div class="text-sm">
				{subtitle}
			</div>
		</div>

		{#if highlight}
			<Back />
		{/if}
	</div>
</div>
