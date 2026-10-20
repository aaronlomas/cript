<script lang="ts">
  /**
   * @component Menu
   * @description Presentational dropdown panel. Positioning and visibility are controlled by the parent.
   */
  import type { Snippet } from "svelte";
  import { MENU_STYLES } from "$lib/config/ui-styles";

  interface Props {
    open?: boolean;
    align?: "left" | "right";
    class?: string;
    children?: Snippet;
  }

  let {
    open = false,
    align = "right",
    class: className = "",
    children,
  }: Props = $props();
</script>

{#if open}
  <div
    class="{MENU_STYLES.panel} {align === 'right' ? 'right-0' : 'left-0'} {className}"
    role="menu"
  >
    {@render children?.()}
  </div>
{/if}
