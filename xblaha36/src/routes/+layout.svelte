<script lang="ts">
	import Firebase from '$lib/Firebase.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { itemManager } from '$ts/stores';

	let screenHeight: number;

	onMount(() => {
		itemManager.refreshAvailableItems();
	});
</script>

<svelte:window bind:innerHeight={screenHeight} />

<Firebase />

<div
	style="--darkest: #1C0333; --darker: #360F5A; --lighter: #6A329F; --light: #522081; height: {screenHeight}px"
	class="bg-darkest text-white relative overflow-hidden"
>
	<slot />
</div>
