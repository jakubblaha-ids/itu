<script lang="ts" generics="T extends {id: string | number}">
	import { createEventDispatcher, onMount, tick } from 'svelte';

	const dispatch = createEventDispatcher();

	export let items: T[] = [];
	export let highlightIndex = 0;
	export let highlightItem: T | null = null;
	export let bottomSectionTitle: string;
	export let itemRenderer: (item: T, highlighted: boolean, scrollToItem: () => void) => any;
	export let isItemInBottomSection: (item: T) => boolean;

	if (highlightItem) {
		highlightIndex = items.findIndex((item) => item.id === highlightItem!.id);

		onMount(() => {
			scrollToIndex(highlightIndex);
		});
	}

	let container: HTMLDivElement;
	const itemContainers: HTMLDivElement[] = [];

	function onScroll() {
		for (const [index, itemContainer] of itemContainers.entries()) {
			if (!container || !itemContainer) {
				continue;
			}

			if (itemContainer.offsetTop - 40 > container.scrollTop) {
				highlightIndex = index;
				dispatch('highlight-index', index);
				break;
			}
		}
	}

	async function scrollToIndex(index: number) {
		console.log({ index });

		await tick();

		itemContainers[index].scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}

	function sortItems() {
		items = items.sort((a, b) => {
			if (isItemInBottomSection(a) && !isItemInBottomSection(b)) {
				return 1;
			} else if (!isItemInBottomSection(a) && isItemInBottomSection(b)) {
				return -1;
			} else {
				return 0;
			}
		});
	}

	$: items && sortItems();
	$: areAllInBottomSection = items.every((item) => isItemInBottomSection(item));
	$: highlightItem = items[highlightIndex];
</script>

<div
	bind:this={container}
	on:scroll={onScroll}
	class="flex-grow flex flex-col px-3 overflow-scroll snap-y snap-mandatory"
>
	{#each items as item, index}
		{#if (isItemInBottomSection(item) && isItemInBottomSection(items[index - 1]) === false) || (areAllInBottomSection && index === 0)}
			<div
				class="py-3 px-4 mt-3 mb-1 duration-300 bg-darker -mx-3 sticky top-0 z-10"
				class:translate-y-6={index > highlightIndex}
			>
				{bottomSectionTitle}
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
					class:translate-y-12={isItemInBottomSection(item) &&
						isItemInBottomSection(items[highlightIndex])}
				>
					{@render itemRenderer(item, item === highlightItem, () => scrollToIndex(index))}
				</div>
			</div>
		</div>
	{/each}

	<div class="h-full flex-shrink-0"></div>
</div>
