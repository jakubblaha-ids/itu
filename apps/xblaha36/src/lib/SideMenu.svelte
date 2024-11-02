<script lang="ts">
	import Bin from '$icons/bin.icon.svelte';
	import Duplicate from '$icons/duplicate.icon.svelte';
	import Import from '$icons/import.icon.svelte';
	import Plus from '$icons/plus.icon.svelte';
	import Share from '$icons/share.icon.svelte';
	import MenuButton from './MenuButton.svelte';
	import { listManager, userManager } from '$ts/global';
	import User from '$icons/user.icon.svelte';
	import { config } from '$ts/Config';

	let props: {
		onChangeUsernameClick: () => void;
		closeMenu: () => void;
		onImport: () => void;
		onRemove: () => void;
		onShare: () => void;
	} = $props();

	const username = userManager.username;
</script>

<div class="h-full flex flex-col bg-darker">
	<div class="px-4 pt-4 text-xs text-gray-300">Logged in as</div>
	<div class="px-4 pt-2 text-lg">{$username}</div>

	<div class="flex-grow"></div>

	<div class="rounded-t-xl bg-lighter flex flex-col shadow-lg overflow-hidden">
		<div class="text-sm px-4 bg-light py-3">Menu</div>

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
				props.onRemove();
				props.closeMenu();
			}}
			title="Remove list"
			icon={Bin}
		/>
		<MenuButton title="Duplicate" icon={Duplicate} />
		<MenuButton title="Share" icon={Share} on:click={props.onShare} />
		<MenuButton title="Import" icon={Import} on:click={props.onImport} />

		<div class="text-sm px-4 bg-light py-3">Sorting</div>

		<MenuButton
			on:click={() => {
				$config.sorting = 'category';
				props.closeMenu();
			}}
			highlight={$config.sorting === 'category'}
			title="Sort by category"
			icon={Share}
		/>
		<MenuButton
			on:click={() => {
				$config.sorting = 'alpha';
				props.closeMenu();
			}}
			highlight={$config.sorting === 'alpha'}
			title="Sort alphabetically"
			icon={Import}
		/>
	</div>
</div>
