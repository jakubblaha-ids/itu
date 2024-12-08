<script lang="ts">
	import WelcomeScreen from '$lib/partials/WelcomeScreen.svelte';
	import Homepage from '$lib/Screens/Homepage.svelte';
	import { listManager } from '$ts/global';

	const { selectedListDataStore } = listManager;
</script>

{#if $selectedListDataStore}
	<Homepage />
{:else}
	<WelcomeScreen />
{/if}
