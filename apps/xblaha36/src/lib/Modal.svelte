<script lang="ts">
	import { screenHeight } from '$ts/stores';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<div
	class="fixed left-0 bottom-0 w-screen z-30 bg-black/50 flex flex-col justify-end backdrop-blur-xl h-screen"
	transition:fly={{ y: $screenHeight, opacity: 100 }}
>
	<div class="h-[90vh] rounded-t-xl flex flex-col bg-darker items-center pt-4">
		<div class="text-xl font-semibold">{title}</div>

		<div class="flex-grow w-full">
			{@render children?.()}
		</div>
	</div>
</div>
