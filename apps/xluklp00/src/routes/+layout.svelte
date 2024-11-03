<script lang="ts">
	import '../app.css';
	import Firebase from '$lib/components/Firebase.svelte';
	let { children } = $props();
</script>

<Firebase />

{@render children()}
