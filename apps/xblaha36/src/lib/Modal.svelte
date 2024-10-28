<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<div
	class="fixed inset-0 z-30 bg-black/50 flex flex-col justify-end backdrop-blur-xl"
	transition:fly={{ y: 800, opacity: 100 }}
>
	<div class="h-[90vh] rounded-t-xl flex flex-col bg-darker items-center py-8">
		<div class="text-xl">{title}</div>

		<div class="flex-grow w-full">
			{@render children?.()}
		</div>
	</div>
</div>
