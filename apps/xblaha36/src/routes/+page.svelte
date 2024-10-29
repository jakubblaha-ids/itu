<script lang="ts">
	import WelcomeScreen from '$lib/partials/WelcomeScreen.svelte';
	import Homepage from '$lib/Screens/Homepage.svelte';
	import { listManager } from '$ts/stores';

	const { selectedListDataStore } = listManager;

	selectedListDataStore.subscribe(console.log);
</script>

{#if $selectedListDataStore}
	<Homepage />
{:else}
	<WelcomeScreen />
{/if}
