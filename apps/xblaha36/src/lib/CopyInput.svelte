<script lang="ts">
	import Copy from '$icons/copy.icon.svelte';

	interface Props {
		inputValue?: string;
		onCopy: () => void;
	}

	let { inputValue = 'Text to copy', onCopy }: Props = $props();
	let inputElement: HTMLInputElement | null = null;

	function copyToClipboard() {
		if (inputElement) {
			inputElement.select();
			// document.execCommand('copy');
		}

		onCopy();
	}
</script>

<button
	onclick={copyToClipboard}
	class="flex items-center px-4 py-4 rounded-lg bg-darkest cursor-pointer active:bg-lightest"
>
	<input
		bind:this={inputElement}
		type="text"
		value={inputValue}
		disabled
		class="flex-grow bg-transparent cursor-pointer"
	/>

	<div class="ml-2 w-4">
		<Copy />
	</div>
</button>
