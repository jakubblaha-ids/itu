<script lang="ts">
	import Back from '$icons/back.icon.svelte';
	import type { Item } from '$ts/types';

	export let item: Item;
	export let highlight = false;
	export let subtitle = '';
</script>

<button
	on:click
	class="flex items-center rounded-lg h-20 bg-light overflow-hidden select-none relative duration-100 flex-shrink-0 text-left"
>
	<div class="flex py-4 px-4 w-full flex-shrink-0 duration-100 items-center">
		<div class="flex-grow flex-col">
			<div>
				{item.name}
			</div>

			{#if subtitle}
				<div class="text-sm opacity-80">
					{subtitle}
				</div>
			{/if}
		</div>

		{#if highlight}
			<Back />
		{/if}
	</div>
</button>
