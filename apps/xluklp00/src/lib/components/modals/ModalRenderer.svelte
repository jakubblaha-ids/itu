<script lang="ts">
	import { activeModal, NameToModal } from "$lib/script/modal";
	import { onMount, type Component } from "svelte";

    function closeModal() {
        activeModal.set(null);
    }

    let ModalComponent: Component | null = $state(null);

    onMount(() => {
        activeModal.subscribe((value) => {
            if(value == null) {
                document.body.style.overflow = "auto";
                ModalComponent = null;
                return;
            }

            document.body.style.overflow = "hidden";
            ModalComponent = NameToModal[value];
        });
    });
</script>

<div class="">
    {#if ModalComponent != null}
        <ModalComponent onClose={closeModal}></ModalComponent>
    {/if}
</div>