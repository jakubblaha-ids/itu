<!-- Author: Pavel Lukl, xluklp00 -->

<script lang="ts">
	import '../app.css';
	import DataReload from '$lib/components/DataReload.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ModalRenderer from '$lib/components/modals/ModalRenderer.svelte';

	let { children } = $props();
</script>

<DataReload />

<div class="w-full h-[90vh]">
	<Navbar></Navbar>
	<ModalRenderer></ModalRenderer>
	<div class="mt-20 h-full w-full">
		{@render children()}
	</div>
</div>
