<script lang="ts">
	import { onNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import Menu from "$icons/Menu.svelte";
	import User from "$icons/User.svelte";
	import { userManager } from "$lib/script";
	import { activeModal } from "$lib/script/modal";
	import { fade } from "svelte/transition";

    const { username } = userManager;

    onNavigate(() => {
        $activeModal = null;
    });
</script>

<div class="fixed top-0 w-full bg-gray h-20 z-20 flex place-content-between items-center px-4">
    {#if !$page.url.pathname?.endsWith('/lists')}
        <div transition:fade>
            <a href="/lists" class="h-full px-2 grid place-items-center">
                <div class="w-6 h-6 grid place-items-center text-white button-nshadow">
                    <Menu></Menu>
                </div>
            </a>
        </div>
    {/if}

    <div class="flex-grow"></div>

    <button onclick={() => $activeModal = 'user'} class="h-full px-2 flex items-center gap-x-2">
        <div class="text-white text-lg">
            {$username}
        </div>

        <div class="w-8 h-8 grid place-items-center text-white button-nshadow">
            <User></User>
        </div>
    </button>

    <div class="h-1 w-full bg-blue absolute left-0 right-0 bottom-0"></div>
</div>