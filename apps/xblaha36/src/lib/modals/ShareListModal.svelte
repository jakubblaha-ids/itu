<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/Button.svelte';
	import CopyInput from '$lib/CopyInput.svelte';
	import Filler from '$lib/Filler.svelte';
	import Modal from '$lib/Modal.svelte';
	import { listManager } from '$ts/stores';
	import { fade } from 'svelte/transition';

	interface Props {
		close: () => void;
	}

	let props: Props = $props();

	const { selectedListDataStore } = listManager;

	let showCopied = $state(false);
	let shareListUrl = $derived($page.url.host + '/import-list?code=' + $selectedListDataStore);
</script>

<Modal title="Share List" {...props}>
	<div class="flex flex-col items-center justify-center pt-8 h-full">
		<div class="text font-semibold">Use list code</div>
		<div class="text-4xl font-bold mt-2">{$selectedListDataStore?.code}</div>

		<div class="font-semibold mt-8">or use this URL</div>

		<div class="mt-4">
			<CopyInput
				onCopy={() => {
					showCopied = true;
					setTimeout(() => (showCopied = false), 200);
				}}
				inputValue={shareListUrl}
			></CopyInput>
		</div>

		{#if showCopied}
			<div out:fade={{ duration: 1000 }} class="mt-4 text-xl text-gray-200">Copied!</div>
		{/if}

		<Filler />

		<Button onclick={props.close} class="mb-16">Close</Button>
	</div>
</Modal>
