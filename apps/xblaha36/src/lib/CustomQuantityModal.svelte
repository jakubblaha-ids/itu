<script lang="ts">
	import Modal from './Modal.svelte';

	interface Props {
		onConfirm: (amount: string) => void;
	}

	let { onConfirm }: Props = $props();

	let quantity = $state('');
</script>

<Modal title="Custom quantity">
	<div class="px-4 py-4 w-full flex flex-col gap-y-3 items-center">
		<input
			bind:value={quantity}
			type="text"
			class="h-14 bg-light rounded-lg w-full outline-none px-4 text-center focus:bg-lighter duration-100"
		/>

		<button
			onclick={() => onConfirm(quantity)}
			class="bg-light py-4 rounded-lg font-semibold w-32 shadow-lg">Confirm</button
		>
	</div>
</Modal>
