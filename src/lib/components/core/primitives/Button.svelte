<script lang="ts">
  /**
   * @component Button
   * @description Reusable button component with multiple variations and sizes.
   * Extends the standard attributes of an HTML button.
   */
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "link";
    size?: "sm" | "md" | "lg" | "icon";
    active?: boolean;
    children?: Snippet;
  }

  let {
    variant = "primary",
    size = "md",
    active = false,
    children,
    class: className = "",
    type = "button",
    ...rest
  }: Props = $props();

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 shadow-md shadow-accent/20",
    secondary:
      "bg-surface/5 text-text-secondary border border-surface/10 hover:bg-surface/10 hover:text-text-primary",
    danger: "bg-danger text-white hover:bg-danger/90",
    ghost:
      "bg-transparent text-text-secondary hover:bg-surface/5 hover:text-text-primary",
    link: "bg-transparent text-accent hover:text-accent-light hover:bg-transparent",
  };

  const activeStyles = "bg-surface/10 text-text-primary";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
    icon: "p-2",
  };
</script>

<button
  {type}
  class="{baseStyles} {variants[variant]} {variant === 'link'
    ? ''
    : sizes[size]} {active ? activeStyles : ''} {className}"
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</button>
