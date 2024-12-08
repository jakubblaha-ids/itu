<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Filler from '$lib/components/Filler.svelte';
	import Modal from '$lib/modals/Modal.svelte';

	interface Props {
		title: string;
		closeButtonText: string;
		close: () => void;
		children?: Snippet;
	}

	let props: Props = $props();
</script>

<Modal title={props.title}>
	<div class="px-4 py-4 w-full flex flex-col gap-y-3 items-center h-full">
		<Filler />

		{@render props.children?.()}

		<Filler />

		<Button onclick={props.close} class="mb-16">
			{props.closeButtonText}
		</Button>
	</div>
</Modal>
