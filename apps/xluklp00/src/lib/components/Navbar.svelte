<script lang="ts">
	import { goto } from "$app/navigation";
	import Menu from "$icons/Menu.svelte";
	import User from "$icons/User.svelte";
	import { activeModal, userManager } from "$lib/script";

    const { username } = userManager;
</script>

<div class="fixed top-0 w-full bg-gray h-20 z-20 flex place-content-between items-center px-4">
    <button onclick={() => goto("/lists")} class="h-full px-2 button-nshadow">
        <div class="w-6 h-6 grid place-items-center text-white">
            <Menu></Menu>
        </div>
    </button>

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