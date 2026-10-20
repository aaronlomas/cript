<script lang="ts">
  /**
   * @component SearchInput
   * @description Search field with a leading icon, built on top of Input.
   */
  import type { HTMLInputAttributes } from "svelte/elements";
  import { IconSearch } from "@tabler/icons-svelte";
  import Input from "./Input.svelte";

  interface Props extends HTMLInputAttributes {
    value?: string;
    class?: string;
    inputClass?: string;
  }

  let {
    value = $bindable(""),
    class: className = "",
    inputClass = "",
    id = crypto.randomUUID(),
    ...rest
  }: Props = $props();
</script>

<Input
  {id}
  variant="triple"
  bind:value
  class={className}
  inputClass="pl-1 {inputClass}"
  {...rest}
>
  {#snippet icon()}
    <IconSearch size={18} class="text-text-muted" />
  {/snippet}
</Input>
