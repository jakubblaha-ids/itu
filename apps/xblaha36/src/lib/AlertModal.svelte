<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import Filler from './Filler.svelte';
	import Modal from './Modal.svelte';

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
