<script lang="ts">
	import Firebase from '$lib/Firebase.svelte';
	import { itemManager, screenHeight } from '$ts/global';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		// @ts-ignore
		window.itemManager = itemManager;
	});
</script>

<svelte:window bind:innerHeight={$screenHeight} />

<Firebase />

<div
	style="--darkest: #1C0333; --darker: #360F5A; --lighter: #6A329F; --light: #522081; --lightest: #8C6C9D; height: {$screenHeight}px; "
	class="bg-darkest text-white relative overflow-hidden mx-auto"
>
	<slot />
</div>
