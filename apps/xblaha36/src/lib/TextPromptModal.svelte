<script lang="ts">
	import Cancel from '$icons/cancel.icon.svelte';
	import Check from '$icons/check.icon.svelte';
	import Modal from './Modal.svelte';

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
</script>

<Modal {title}>
	<div class="px-4 py-4 w-full flex flex-col gap-y-3 items-center">
		<input
			bind:value
			{placeholder}
			type="text"
			class="h-24 bg-light rounded-lg w-full outline-none px-4 text-center focus:bg-lighter duration-100 text-xl"
		/>

		<div class="w-full flex justify-end gap-x-2">
			<button
				onclick={goBack}
				class="py-4 rounded-lg font-semibold w-32 shadow-lg flex items-center justify-center gap-x-2 flex-grow bg-[#52202E]"
			>
				Cancel

				<div class="w-6">
					<Cancel />
				</div>
			</button>

			<button
				disabled={!isValid}
				onclick={() => onConfirm(value)}
				class="bg-[#528281] py-4 rounded-lg font-semibold w-32 shadow-lg flex items-center gap-x-2 justify-center flex-grow"
			>
				Confirm
				<div class="w-6">
					<Check />
				</div>
			</button>
		</div>
	</div>
</Modal>
