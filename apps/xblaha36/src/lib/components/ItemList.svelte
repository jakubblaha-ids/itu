<!--
Jakub Blaha, xblaha36

A special list of items. There will always be one highlighted item.
Which item is highlighted depends on the scroll position of the container.
The top-most visible element will always be highlighted first.
-->

<script lang="ts" generics="T extends {id: string | number}">
	import { createEventDispatcher, tick } from 'svelte';

	const dispatch = createEventDispatcher();

	interface Props {
		items?: T[];

		// Index of highlighted item. Not intended for controlling the highlight, only for listening.
		highlightIndex?: number;

		// Currently highlighted item object. Do not set, readonly.
		highlightItem?: T | null;

		// The list is divided into two sections. Unchecked item (or search results)
		// and checked items (or items already on list when used to display search results)
		bottomSectionTitle: string;

		// Snippet to render a single item.
		itemRenderer: (item: T, highlighted: boolean, scrollToItem: () => void) => any;

		// A function which will be called for every item and needs to return whether
		// the item is in the bottom section or not.
		isItemInBottomSection: (item: T) => boolean;
	}

	let {
		items = $bindable([]),
		highlightIndex = $bindable(0),
		highlightItem = $bindable(null),
		bottomSectionTitle,
		itemRenderer,
		isItemInBottomSection
	}: Props = $props();

	if (highlightItem) {
		highlightIndex = items.findIndex((item) => item.id === highlightItem!.id);
	}

	let container = $state<HTMLDivElement>();
	const itemContainers: HTMLDivElement[] = $state([]);

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
		await tick();

		itemContainers[index].scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}

	function sortItems() {
		const topSection = items.filter((i) => !isItemInBottomSection(i));
		const bottomSection = items.filter((i) => isItemInBottomSection(i));

		items = [...topSection, ...bottomSection];
	}

	// Will sort items to top and bottom section whenever the items change.
	$effect(() => {
		items && sortItems();
	});

	let areAllInBottomSection = $derived(items.every((item) => isItemInBottomSection(item)));

	$effect(() => {
		highlightItem = items[highlightIndex];
	});
</script>

<div
	bind:this={container}
	onscroll={onScroll}
	class="flex-grow flex flex-col px-3 overflow-scroll snap-y snap-mandatory"
>
	{#each items as item, index}
		{#if (isItemInBottomSection(item) && isItemInBottomSection(items[index - 1]) === false) || (areAllInBottomSection && index === 0)}
			<div
				class="py-3 px-4 mt-2.5 mb-px duration-300 bg-darker -mx-3 sticky top-0 z-10"
				class:translate-y-6={index > highlightIndex}
			>
				{bottomSectionTitle}
			</div>
		{/if}

		<div
			bind:this={itemContainers[index]}
			class="snap-start overflow-visible flex-shrink-0 relative h-[4.9rem] pointer-events-none"
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
