<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AlertModal from '$lib/AlertModal.svelte';
	import Sad from '$icons/sad.img.svelte';
	import { listManager } from '$ts/stores';
	import { onMount } from 'svelte';
	import Happy from '$icons/happy.img.svelte';
	import InvalidListCodeModal from '$lib/partials/InvalidListCodeModal.svelte';

	const code = parseInt($page.url.searchParams.get('code') || '0');
	let isCodeValid = $state(code >= 1000 && code <= 9999);

	let imported = $state(false);

	async function importList() {
		try {
			await listManager.importList(code);
		} catch (e) {
			console.error(e);
			isCodeValid = false;
		}

		imported = true;
	}

	onMount(async () => {
		if (isCodeValid) {
			importList();
		}
	});
</script>

{#if !isCodeValid}
	<InvalidListCodeModal />
{:else if imported}
	<AlertModal close={() => goto('/')} title="Imported" closeButtonText="Go to list">
		<div class="w-48 text-gray-300">
			<Happy />
		</div>

		<div class="mt-8 text-xl">The list has been imported successfully!</div>
	</AlertModal>
{:else}
	<div class="flex flex-col h-full items-center justify-center">
		<div class="text-2xl font-semibold">Importing list...</div>
	</div>
{/if}
