<script setup lang="ts">
import { ref, defineProps } from 'vue';

const props = defineProps<{
    // text: string;
    // onEdit: () => void;
    // onDelete: () => void;
    onClose: () => void;
}>();

function onSave(){
    console.log('save');
    // props.onEdit();
}


</script>

<template>
    <div class="modal">
        <div class="modal-content">
            <p>Some text in the Modal..</p>
            <!-- <span class="close">&times;</span> -->
            <button @click="onSave">save</button> 
            <button @click="onClose">&times;</button> 
        </div>
    </div>
</template>


<style>



</style>