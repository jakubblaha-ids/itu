<div
	id="bottom-nav"
	class="bg-darker h-32 grid grid-cols-3 p-2 gap-x-2 shadow-[0_0_12px] shadow-black/30 flex-shrink-0"
>
	<slot />
</div>

<style>
	#bottom-nav > :global(button) {
		@apply bg-light rounded-xl active:brightness-90 duration-100 grid place-items-center;
	}
</style>
