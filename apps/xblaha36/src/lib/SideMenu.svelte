<script lang="ts">
	import Bin from '$icons/bin.icon.svelte';
	import Duplicate from '$icons/duplicate.icon.svelte';
	import Import from '$icons/import.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';
	import Share from '$icons/share.icon.svelte';
	import MenuButton from './MenuButton.svelte';
	import { listManager, userManager } from '$ts/stores';
	import User from '$icons/user.icon.svelte';

	let props: { onChangeUsernameClick: () => void; closeMenu: () => void } = $props();

	const username = userManager.username;
</script>

<div class="h-full flex flex-col bg-darker">
	<div class="px-4 pt-4 text-xs text-gray-300">Logged in as</div>
	<div class="px-4 pt-2 text-lg">{$username}</div>

	<div class="flex-grow"></div>

	<div class="rounded-t-xl bg-lighter flex flex-col shadow-lg overflow-hidden">
		<div class="text-sm px-4 bg-light py-3">Manipulate list</div>

		<MenuButton on:click={props.onChangeUsernameClick} title="Change username" icon={User} />
		<MenuButton
			on:click={() => {
				listManager.createList();
				props.closeMenu();
			}}
			title="New List"
			icon={Plus}
		/>
		<MenuButton
			on:click={() => {
				listManager.removeListLocally(listManager.selectedListId!);
			}}
			title="Remove list"
			icon={Bin}
		/>
		<MenuButton title="Duplicate" icon={Duplicate} />
		<MenuButton title="Share" icon={Share} />
		<MenuButton title="Import" icon={Import} />

		<div class="text-sm px-4 bg-light py-3">Sorting</div>

		<MenuButton title="Sort by category" icon={Share} />
		<MenuButton title="Sort alphabetically" icon={Import} />
	</div>
</div>
