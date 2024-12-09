<!-- 
Jakub Blaha, xblaha36

A modal telling the user that the list code used for importing a list is invalid.
-->

<script lang="ts">
	import { goto } from '$app/navigation';
	import Sad from '$icons/sad.img.svelte';
	import AlertModal from '$lib/modals/AlertModal.svelte';
</script>

<AlertModal close={() => goto('/')} title="Invalid code" closeButtonText="Back to list">
	<div class="w-48 text-gray-300">
		<Sad />
	</div>

	<div class="mt-8 text-xl">The list share code is invalid.</div>
</AlertModal>
