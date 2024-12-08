<script lang="ts">
	import Cancel from '$icons/cancel.icon.svelte';
	import Check from '$icons/check.icon.svelte';
	import { onMount } from 'svelte';
	import Modal from '$lib/modals/Modal.svelte';

	interface Props {
		onConfirm: (value: string) => void;
		goBack: () => void;
		validator?: (value: string) => boolean;
		title: string;
		placeholder?: string;
	}

	let {
		onConfirm,
		goBack,
		title,
		placeholder = '',
		validator = (v) => v.length > 0
	}: Props = $props();

	let value = $state('');
	let isValid = $derived(validator(value));

	let input: HTMLInputElement;

	onMount(() => {
		input.focus();
	});
</script>

<Modal {title} aboveKeyboard>
	<div class="px-4 py-4 w-full flex flex-col gap-y-3 items-center">
		<input
			bind:this={input}
			bind:value
			{placeholder}
			type="text"
			class="h-24 bg-light rounded-lg w-full outline-none px-4 text-center focus:bg-lighter duration-100 text-xl"
		/>

		<div class="w-full flex justify-end gap-x-3">
			<button
				onclick={goBack}
				class="py-8 rounded-lg font-semibold w-32 shadow-lg flex items-center justify-center gap-x-2 bg-light"
			>
				<div class="w-6">
					<Cancel />
				</div>
			</button>

			<button
				disabled={!isValid}
				onclick={() => onConfirm(value)}
				class="py-8 rounded-lg font-semibold w-32 shadow-lg flex items-center gap-x-2 justify-center flex-grow bg-lighter"
			>
				<div class="w-6">
					<Check />
				</div>
			</button>
		</div>
	</div>
</Modal>
