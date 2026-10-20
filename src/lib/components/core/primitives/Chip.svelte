<script lang="ts">
  /**
   * @component Chip
   * @description Compact selectable chip used for filters and tags.
   */
  import type { Snippet } from "svelte";
  import { CHIP_STYLES } from "$lib/config/ui-styles";

  interface Props {
    active?: boolean;
    shape?: "sm" | "full";
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    active = false,
    shape = "sm",
    onclick,
    class: className = "",
    children,
  }: Props = $props();
</script>

<button
  type="button"
  aria-pressed={active}
  class="{CHIP_STYLES.base} {shape === 'full'
    ? 'rounded-full'
    : 'rounded-sm'} {active ? CHIP_STYLES.active : CHIP_STYLES.inactive} {className}"
  {onclick}
>
  {@render children?.()}
</button>
