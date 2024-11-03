<script lang="ts">
	import { onMount } from "svelte";

    let { code = $bindable() }: { code: string } = $props();

    let codeArr = $state(Array(4).fill(''));

    onMount(() => {
        const firstInput = document.getElementById('code-0');
        firstInput && firstInput.focus();
    });


	function handleInput(event: Event, index: number) {        
		const target = event.target as HTMLInputElement;

        if(isNaN(parseInt(target.value))) {
            target.value = '';
            return;
        }

		codeArr[index] = target.value.slice(0, 1);

		if (target.value && index < codeArr.length - 1) {
			const nextInput = document.getElementById(`code-${index + 1}`);
			nextInput && nextInput.focus();
		}

        code = codeArr.join('');
	}

	function handleBackspace(event: KeyboardEvent, index: number) {
		if (event.key === 'Backspace' && index > 0 && !codeArr[index]) {
			const prevInput = document.getElementById(`code-${index - 1}`);
			prevInput && prevInput.focus();
		}

        code = codeArr.join('');
	}

</script>


<div class="flex space-x-2">
	{#each codeArr as digit, index}
		<input
			bind:value={codeArr[index]}
			id={`code-${index}`}
			maxlength="1"
			class="w-12 h-12 text-center border border-gray text-gray font-semibold rounded focus:outline-none focus:border-blue text-lg"
			oninput={(e) => handleInput(e, index)}
			onkeydown={(e) => handleBackspace(e, index)}
			autocomplete="one-time-code"
            type="number"
		/>
	{/each}
</div>
