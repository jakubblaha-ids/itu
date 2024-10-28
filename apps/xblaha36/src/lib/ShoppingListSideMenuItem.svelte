<script lang="ts">
	export let title: string;
	export let newItems: number;
	export let active: boolean;
</script>

<button
	on:click
	class="h-14 text-white text-lg px-4 text-left active:brightness-90 flex items-center duration-100 bg-lighter mx-1.5 rounded-lg"
	class:!bg-light={active}
>
	<div class="flex-grow">
		{title}
	</div>

	{#if newItems > 0}
		<div
			class="text-white rounded-full w-6 h-6 flex justify-center items-center bg-darker py-4 px-4 text-sm"
		>
			{newItems}
		</div>
	{/if}
</button>
