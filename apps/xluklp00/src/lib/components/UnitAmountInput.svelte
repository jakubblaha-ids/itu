<script lang="ts">
	import { fade } from "svelte/transition";

    let { defaultStep, value = $bindable() } = $props();

    let step: number = $state(defaultStep);

    function adjustClick(adjustment: number) {
        value += adjustment;
        step = Math.abs(adjustment);
    }

    $effect(() => {
        step = defaultStep;
    });
</script> 

<div class="w-full flex gap-4 items-center justify-center" in:fade>
    <div class="flex flex-col gap-4">
        <button disabled={value <= 10} onclick={() => adjustClick(-10)} class="rounded-3xl w-12 bg-blue text-white py-1 px-2 grid place-items-center button disabled:active:transform-none disabled:opacity-50">
            -10
        </button>

        <button disabled={value <= 50} onclick={() => adjustClick(-50)} class="rounded-3xl w-12 bg-blue text-white py-1 px-2 grid place-items-center button disabled:active:transform-none disabled:opacity-50">
            -50
        </button>
    </div>
    <div class="flex flex-col gap-4">
        <button disabled={value <= 1} onclick={() => adjustClick(-1)} class="rounded-3xl w-12 bg-blue text-white py-1 px-2 grid place-items-center button disabled:active:transform-none disabled:opacity-50">
            -1
        </button>

        <button disabled={value <= 5} onclick={() => adjustClick(-5)} class="rounded-3xl w-12 bg-blue text-white py-1 px-2 grid place-items-center button disabled:active:transform-none disabled:opacity-50">
            -5
        </button>
    </div>

    <div class="w-24 h-24 text-lg font-semibold rounded-2xl bg-black relative grid place-items-center">
        <input bind:value={value} step={step} type="number" class="w-full h-8 bg-black text-white text-center"/>
    </div>

    <div class="flex flex-col gap-4">
        <button onclick={() => adjustClick(1)} class="rounded-3xl w-12 bg-blue text-white py-1 px-2 grid place-items-center button">
            +1
        </button>

        <button onclick={() => adjustClick(5)} class="rounded-3xl w-12 bg-blue text-white py-1 px-2 grid place-items-center button">
            +5
        </button>
    </div>
    <div class="flex flex-col gap-4">
        <button onclick={() => adjustClick(+10)} class="rounded-3xl w-12 bg-blue text-white py-1 px-2 grid place-items-center button">
            +10
        </button>

        <button onclick={() => adjustClick(+50)} class="rounded-3xl w-12 bg-blue text-white py-1 px-2 grid place-items-center button">
            +50
        </button>
    </div>
</div>