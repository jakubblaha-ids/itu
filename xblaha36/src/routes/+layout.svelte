<script lang="ts">
	import '../app.css';

	let screenHeight: number;
</script>

<svelte:window bind:innerHeight={screenHeight} />

<div
	style="--darkest: #1C0333; --darker: #360F5A; --lighter: #6A329F; --light: #522081; height: {screenHeight}px"
	class="bg-darkest text-white relative overflow-hidden"
>
	<slot />
</div>
