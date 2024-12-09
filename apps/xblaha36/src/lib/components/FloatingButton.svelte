<!-- 
Jakub Blaha, xblaha36

Button absolutely positioned to be above the app navigation bar.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		children: Snippet;
		onclick: () => void;
		class?: string;
	}

	let props: Props = $props();
</script>

<button
	transition:fade={{ duration: 200 }}
	onclick={props.onclick}
	class="{props.class ??
		''} rounded-lg bg-light w-24 h-24 absolute right-2 bottom-36 shadow-xl grid place-items-center translate-y-2 active:brightness-90 duration-100 z-20"
>
	<div class="scale-125">
		{@render props.children?.()}
	</div>
</button>
