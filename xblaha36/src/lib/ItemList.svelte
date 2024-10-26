<script lang="ts">
	import type { InListItem } from '$ts/types';
	import { createEventDispatcher } from 'svelte';
	import ItemListItem from './ItemListItem.svelte';

	const dispatch = createEventDispatcher();

	export let items: InListItem[] = [];
	export let highlightIndex = 0;

	let container: HTMLDivElement;
	const itemContainers: HTMLDivElement[] = [];

	function onScroll() {
		for (const [index, itemContainer] of itemContainers.entries()) {
			// console.log(itemContainer.offsetTop, container.scrollTop);
			// break;

			if (itemContainer.offsetTop - 40 > container.scrollTop) {
				highlightIndex = index;
				dispatch('highlight-index', index);
				break;
			}
		}
	}

	function scrollToIndex(index: number) {
		itemContainers[index].scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}

	function sortItems() {
		items = items.sort((a, b) => {
			if (a.itemChecked && !b.itemChecked) {
				return 1;
			} else if (!a.itemChecked && b.itemChecked) {
				return -1;
			} else {
				return 0;
			}
		});
	}

	$: items && sortItems();
	$: allChecked = items.every((item) => item.itemChecked);
</script>

<div
	bind:this={container}
	on:scroll={onScroll}
	class="flex-grow flex flex-col px-3 overflow-scroll snap-y snap-mandatory"
>
	{#each items as item, index}
		{#if (item.itemChecked && items[index - 1]?.itemChecked === false) || (allChecked && index === 0)}
			<div
				class="py-3 px-4 mt-3 mb-1 duration-300 bg-darker -mx-3 sticky top-0 z-10"
				class:translate-y-6={index > highlightIndex}
			>
				Checked items
			</div>
		{/if}

		<div
			bind:this={itemContainers[index]}
			class="snap-start overflow-visible flex-shrink-0 relative h-16 pointer-events-none"
		>
			<div
				class="absolute w-full duration-300 left-0 top-2"
				class:translate-y-6={index > highlightIndex}
			>
				<div
					class="duration-300"
					class:translate-y-12={item.itemChecked && items[highlightIndex].itemChecked}
				>
					<ItemListItem
						{item}
						on:item-click={() => {
							item.itemChecked = !item.itemChecked;
							items = items;
							// dispatch('highlight-index', index);
							// scrollToIndex(index);
						}}
						on:edit-click={(e) => {
							scrollToIndex(index);
							e.detail.resetShowButton();
						}}
						highlight={index === highlightIndex}
						checked={item.itemChecked}
					/>
				</div>
			</div>
		</div>
	{/each}

	<div class="h-full flex-shrink-0"></div>
</div>
