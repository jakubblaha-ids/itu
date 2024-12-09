<!-- 
Jakub Blaha, xblaha36

A small wide button absolutely positioned above the app navigation bar. Used for
Undo and Delete checked-off functionality.
-->

<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Component } from 'svelte';

	interface Props {
		onclick: () => void;
		text: string;
		icon?: Component;
		additionalClasses?: string;
	}

	let { onclick, text, icon, additionalClasses = '' }: Props = $props();

	const SvelteComponent_1 = $derived(icon);
</script>

<button
	transition:fade
	{onclick}
	class="bg-light absolute bottom-36 translate-y-2 left-2 px-4 py-4 rounded-lg flex gap-x-2 pr-6 {additionalClasses}"
>
	{#if icon}
		<div class="scale-75">
			<SvelteComponent_1 />
		</div>
	{/if}

	{text}
</button>
