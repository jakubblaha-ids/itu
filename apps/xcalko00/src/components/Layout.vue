<script setup lang="ts">
import { ref } from 'vue';

const dropdown = ref(false);
const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
};
</script>

<template>
    <div>
        <header>
            <nav>
                <ul>
                    <router-link to="/">Home</router-link>
                    <router-link to="/about">About</router-link>

                    <button @click="toggleDropdown">...</button>
                    <div v-if="dropdown">Dropdown</div>
                </ul>         
            </nav>
        </header>
    </div>
</template>

<style scoped>
.header {
    background-color: #cb9090;
    color: white;
    padding: 1rem;
}

</style>