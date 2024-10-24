<div class="bg-darker h-24 grid grid-cols-3 p-2 gap-x-2 shadow-xl flex-shrink-0">
	<slot />
</div>

<style>
	:global(button) {
		@apply bg-light rounded-lg active:brightness-90 duration-100 grid place-items-center;
	}
</style>
