<!-- 
Jakub Blaha, xblaha36

Generic app-themed button.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		onclick: () => void;
		class?: string;
	}

	let props: Props = $props();
</script>

<button
	onclick={props.onclick}
	class="px-5 py-3 font-semibold shadow bg-light rounded-lg {props.class ?? ''}"
>
	{@render props.children()}
</button>
