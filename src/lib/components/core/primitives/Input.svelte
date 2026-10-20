<script lang="ts">
  /**
   * @component Input
   * @description Text field with support for labels, errors and optional leading/trailing actions.
   */
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { FIELD_STYLES } from "$lib/config/ui-styles";
  import Field from "./Field.svelte";

  interface Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
    value?: string;
    /** Input structure type */
    variant?: "simple" | "double" | "triple";
    /** Leading icon (required only in 'triple') */
    icon?: Snippet;
    /** Trailing action icon (required in 'double' and 'triple') */
    action?: Snippet;
    /** Extra classes for the inner <input> element */
    inputClass?: string;
    /** Bound reference to the inner <input> element */
    inputRef?: HTMLInputElement;
  }

  let {
    label,
    error,
    value = $bindable(""),
    variant = "simple",
    icon,
    action,
    inputClass = "",
    inputRef = $bindable(),
    class: className = "",
    id = crypto.randomUUID(),
    ...rest
  }: Props = $props();

  // Layout: mapping based on the chosen variant
  const gridLayouts = {
    simple: "grid-cols-1",
    double: "grid-cols-[1fr_auto]",
    triple: "grid-cols-[auto_1fr_auto]",
  };
</script>

<Field {label} {error} for={id}>
  <div
    class="{FIELD_STYLES.box} {gridLayouts[variant]} {error
      ? 'border-danger focus-within:border-danger'
      : ''} {className}"
  >
    {#if variant === "triple" && icon}
      <div class="flex items-center justify-center shrink-0">
        {@render icon()}
      </div>
    {/if}

    <input
      {id}
      bind:this={inputRef}
      bind:value
      class="{FIELD_STYLES.input} {inputClass}"
      {...rest}
    />

    {#if (variant === "double" || variant === "triple") && action}
      <div class="flex items-center justify-center shrink-0">
        {@render action()}
      </div>
    {/if}
  </div>
</Field>
