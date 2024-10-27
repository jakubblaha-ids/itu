<script lang="ts">
	export let title: string;
	export let icon;
</script>

<button
	on:click
	class="h-14 text-white text-lg px-4 text-left active:brightness-90 flex items-center duration-100 bg-lighter"
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
