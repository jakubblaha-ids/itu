<script lang="ts">
	import '../app.css';
	import Firebase from '$lib/components/Firebase.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ModalRenderer from '$lib/components/modals/ModalRenderer.svelte';

	let { children } = $props();
</script>

<Firebase />

<div class="w-full h-screen">
	<Navbar></Navbar>
	<ModalRenderer></ModalRenderer>
	<div class="mt-20 h-full w-full">
		{@render children()}
	</div>
</div>
