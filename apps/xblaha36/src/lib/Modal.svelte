<script lang="ts">
	import { screenHeight } from '$ts/global';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	let {
		title,
		aboveKeyboard = false,
		children
	}: { title: string; aboveKeyboard?: boolean; children: Snippet } = $props();

	const modalHeight = aboveKeyboard ? 'h-[60%]' : 'h-[90%]';
</script>

<div
	class="fixed left-0 bottom-0 w-screen z-30 bg-black/50 flex flex-col justify-end backdrop-blur-xl"
	style="height: {$screenHeight}px;"
	transition:fly={{ y: $screenHeight, opacity: 100 }}
>
	<div class="{modalHeight} rounded-t-xl flex flex-col bg-darker items-center pt-6">
		<div class="text-xl font-semibold">{title}</div>

		<div class="flex-grow w-full">
			{@render children?.()}
		</div>
	</div>
</div>
