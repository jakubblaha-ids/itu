<script lang="ts">
	export let title: string;
	export let icon;
	export let highlight = false;
</script>

<button
	on:click
	class="py-3 text-white text-lg px-4 text-left active:brightness-90 flex items-center duration-100 bg-lighter rounded-lg mx-2 mt-2 last:mb-2"
	class:!bg-light={highlight}
>
	<div class="flex items-center">
		{#if icon}
			<div class="mr-4">
				<svelte:component this={icon} />
			</div>
		{/if}

		{title}
	</div>
</button>
