<script lang="ts">
  /**
   * @component ListItem
   * @description Flexible row component for configuration lists.
   */
  import type { Snippet } from "svelte";

  interface Props {
    layout?: "simple" | "double" | "triple";
    flush?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    layout = "simple",
    flush = false,
    class: className = "",
    children,
  }: Props = $props();

  const layouts = {
    simple: "space-y-4",
    double: "grid grid-cols-[1fr_auto] gap-4 items-center",
    triple: "grid grid-cols-[auto_1fr_auto] gap-4 items-center",
  };

  const variantStyles = $derived(
    flush ? "" : "bg-surface/3 border border-surface/8 rounded-2xl p-4",
  );
</script>

<div class="{variantStyles} {layouts[layout]} {className}">
  {@render children?.()}
</div>
