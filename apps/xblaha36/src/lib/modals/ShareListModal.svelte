<!--
Jakub Blaha, xblaha36

A modal drawer displaying the code and URL of the currently selected list
for sharing.
-->

<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import CopyInput from '$lib/components/CopyInput.svelte';
	import Filler from '$lib/components/Filler.svelte';
	import Modal from '$lib/modals/Modal.svelte';
	import { listManager } from '$ts/global';
	import { fade } from 'svelte/transition';

	interface Props {
		close: () => void;
	}

	let props: Props = $props();

	const { selectedListDataStore } = listManager;

	let showCopied = $state(false);
	let shareListUrl = $derived($page.url.host + '/import-list?code=' + $selectedListDataStore?.code);
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
					console.log('copied');
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
