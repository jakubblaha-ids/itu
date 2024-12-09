<!-- 
Jakub Blaha, xblaha36

Readonly input elemet with a copy button. The input content will
be copied to clipboard upon clicking the clipboard icon.
-->

<script lang="ts">
	import Copy from '$icons/copy.icon.svelte';

	interface Props {
		inputValue?: string;
		onCopy: () => void;
	}

	let { inputValue = 'Text to copy', onCopy }: Props = $props();
	let inputElement: HTMLInputElement | null = null;

	function copyToClipboard() {
		navigator.clipboard.writeText(inputValue);

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
