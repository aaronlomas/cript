<script lang="ts">
  /**
   * @component Field
   * @description Generic form row that renders a label, a control and an error message.
   */
  import type { Snippet } from "svelte";
  import { FIELD_STYLES } from "$lib/config/ui-styles";

  interface Props {
    label?: string;
    error?: string;
    for?: string | null;
    class?: string;
    children: Snippet;
  }

  let {
    label,
    error,
    for: htmlFor,
    class: className = "",
    children,
  }: Props = $props();
</script>

<div class="flex flex-col gap-1.5 w-full {className}">
  {#if label}
    <label for={htmlFor ?? undefined} class={FIELD_STYLES.label}>{label}</label>
  {/if}

  {@render children()}

  {#if error}
    <span class={FIELD_STYLES.error}>{error}</span>
  {/if}
</div>
