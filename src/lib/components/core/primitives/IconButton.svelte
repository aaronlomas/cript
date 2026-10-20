<script lang="ts">
  /**
   * @component IconButton
   * @description Button for icon-only actions with consistent variants and sizes.
   */
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { ICON_BUTTON_STYLES } from "$lib/config/ui-styles";

  interface Props extends HTMLButtonAttributes {
    variant?: keyof typeof ICON_BUTTON_STYLES.variants;
    size?: keyof typeof ICON_BUTTON_STYLES.sizes;
    active?: boolean;
    label?: string;
    children?: Snippet;
  }

  let {
    variant = "default",
    size = "md",
    active = false,
    label,
    children,
    class: className = "",
    type = "button",
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  aria-label={label}
  class="{ICON_BUTTON_STYLES.base} {ICON_BUTTON_STYLES.variants[variant]} {ICON_BUTTON_STYLES.sizes[size]} {active
    ? ICON_BUTTON_STYLES.active
    : ''} {className}"
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</button>
