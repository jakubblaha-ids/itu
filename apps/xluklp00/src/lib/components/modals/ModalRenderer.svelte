<!-- Author: Pavel Lukl, xluklp00 -->
<!-- Dynamically renders active modal -->
<script lang="ts">
	import { activeModal, NameToModal } from "$lib/script/modal";
	import { onMount } from "svelte";

    function closeModal() {
        activeModal.set(null);
    }

    let ModalComponent: any | null = $state(null);

    onMount(() => {
        activeModal.subscribe((value) => {
            // ignore add-item, handled seperately
            if(value == 'add-item') return;
            
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