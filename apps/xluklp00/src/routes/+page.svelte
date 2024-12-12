<!-- Author: Pavel Lukl, xluklp00 -->
<!-- Redirects to last selected list or all lists on mount -->
<script lang="ts">
	import { goto } from '$app/navigation';
  import Loader from '$lib/components/Loader.svelte';
	import { listManager } from '$lib/script';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';

  const { selectedListIdStore } = listManager;

  let unsub: Unsubscriber;

  onMount(() => {
    unsub = selectedListIdStore.subscribe((value) => {
      if(value !== "null") goto(`/lists/${value}`);
      else goto('/lists');
    });
  })

  onDestroy(() => {
    if(!unsub) return;
    unsub();
  })
</script>

<Loader></Loader>