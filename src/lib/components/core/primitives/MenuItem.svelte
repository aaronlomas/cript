<script lang="ts">
  /**
   * @component MenuItem
   * @description Action row for dropdown menus.
   */
  import type { Snippet } from "svelte";
  import { MENU_STYLES } from "$lib/config/ui-styles";

  interface Props {
    variant?: "default" | "danger";
    active?: boolean;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = "default",
    active = false,
    onclick,
    class: className = "",
    children,
  }: Props = $props();
</script>

<button
  type="button"
  role="menuitem"
  class="{MENU_STYLES.item} {active
    ? MENU_STYLES.itemActive
    : variant === 'danger'
      ? MENU_STYLES.itemDanger
      : MENU_STYLES.itemDefault} {className}"
  {onclick}
>
  {@render children?.()}
</button>
