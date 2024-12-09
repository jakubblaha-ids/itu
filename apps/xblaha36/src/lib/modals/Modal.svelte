<!-- 
Jakub Blaha, xblaha36

Base modal drawer.

aboveKeyboard can be set to decrease the drawer height
when keyboard is displayed.
-->

<script lang="ts">
	import { screenHeight } from '$ts/global';
	import type { Snippet } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let {
		title,

		// Set to true to decrease drawer height when displayed above keyboard.
		aboveKeyboard = false,
		children
	}: { title: string; aboveKeyboard?: boolean; children: Snippet } = $props();

	const modalHeight = aboveKeyboard ? 'h-[60%]' : 'h-[90%]';
</script>

<div
	class="fixed left-0 bottom-0 w-screen z-30 bg-black/50 flex flex-col justify-end backdrop-blur-xl overflow-hidden"
	style="height: {$screenHeight}px;"
	in:fly={{ y: 1000, duration: 500, opacity: 1, easing: expoOut }}
	out:fly={{ y: 1000, duration: 800, opacity: 1, easing: expoOut }}
>
	<div class="{modalHeight} rounded-t-xl flex flex-col bg-darker items-center pt-6 overflow-hidden">
		<div class="text-xl font-semibold">{title}</div>

		<div class="flex-grow w-full overflow-hidden flex-shrink">
			{@render children?.()}
		</div>
	</div>
</div>
