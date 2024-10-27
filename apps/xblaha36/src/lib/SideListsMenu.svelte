<script lang="ts">
	import ShoppingListSideMenuItem from './ShoppingListSideMenuItem.svelte';
</script>

<div class="h-full flex flex-col bg-darker">
	<div class="flex-grow"></div>

	<div class="rounded-t-xl bg-lighter flex flex-col py-2 shadow-lg">
		<ShoppingListSideMenuItem title="Shopping list" newItems={1} />
		<ShoppingListSideMenuItem title="Shopping list" />
		<ShoppingListSideMenuItem title="Shopping list" />
	</div>
</div>
