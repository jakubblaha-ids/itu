<script lang="ts">
	import Plus from '$icons/plus.icon.svelte';
	import { listManager } from '$ts/stores';
</script>

<div class="bg-darker grid place-items-center h-full">
	<div class="items-center flex flex-col gap-y-4">
		<div class="text-2xl">Welcome to Shopli!</div>

		<button
			onclick={() => listManager.createList()}
			class="flex gap-x-2 bg-lighter rounded-lg py-2 pl-4 pr-6"
		>
			<Plus />
			<div>Create new list</div>
		</button>
	</div>
</div>
