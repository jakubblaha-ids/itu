<script lang="ts">
	import Check from "$icons/Check.svelte";
import { userManager } from "$lib/script";
	import { onMount } from "svelte";
	import Modal from "./Modal.svelte";

    let { onClose }: {onClose: CallableFunction} = $props();

    const { username } = userManager;

    let inputUsername: string = $state("");

    onMount(() => {
        const input = document.querySelector("input");
        if(!input) return;
        input.focus();
    });

    async function changeUsername(newUsername: string) {
        if(newUsername.length === 0) {
            return;
        }

        try {
            await userManager.setUsername(newUsername);
        } catch (e) {
            console.error(e);
            return;
        }

        onClose();
    }
</script>

<Modal {onClose}>
    <div class='text-gray text-lg'>Change your username</div>
    <input type="text" bind:value={inputUsername} class="w-full input" placeholder="{$username}">
    <button onclick={() => changeUsername(inputUsername)} class="w-2/3 h-10 bg-blue text-white rounded-3xl button grid place-items-center">
        <div class="w-8 h-8">
            <Check></Check>
        </div>
    </button>
</Modal>