<script lang="ts">
  let { value = $bindable('') } = $props();
  let editing = $state(false);
</script>

{#if editing}
  <input
    bind:value
    onblur={() => editing = false}
    onkeydown={(e) => e.key === 'Enter' && (editing = false)}
    class="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
    autofocus
  />
{:else}
  <span
    onclick={() => editing = true}
    class="cursor-pointer border-b border-dashed border-gray-400 hover:border-gray-600 transition-colors"
  >
    {value || 'Click to edit...'}
  </span>
{/if}
