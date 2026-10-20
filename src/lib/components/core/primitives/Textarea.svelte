<script lang="ts">
  /**
   * @component Textarea
   * @description Multiline text field with label and error support.
   */
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { FIELD_STYLES } from "$lib/config/ui-styles";
  import Field from "./Field.svelte";

  interface Props extends HTMLTextareaAttributes {
    label?: string;
    error?: string;
    value?: string;
  }

  let {
    label,
    error,
    value = $bindable(""),
    class: className = "",
    id = crypto.randomUUID(),
    ...rest
  }: Props = $props();
</script>

<Field {label} {error} for={id}>
  <textarea
    {id}
    bind:value
    class="{FIELD_STYLES.textarea} {className}"
    {...rest}
  ></textarea>
</Field>
