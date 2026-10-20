<script lang="ts">
  import { addPin } from "$lib/utils/tauri";
  import { IconEye, IconEyeOff } from "@tabler/icons-svelte";
  import { _ } from "svelte-i18n";
  import { useForm } from "$lib/validation/useForm.svelte";
  import { pinSchema, type PinForm } from "$lib/validation/schemas";
  import Modal from "../../../core/primitives/Modal.svelte";
  import Button from "../../../core/primitives/Button.svelte";
  import Input from "../../../core/primitives/Input.svelte";
  import Textarea from "../../../core/primitives/Textarea.svelte";
  import IconButton from "../../../core/primitives/IconButton.svelte";

  let { onadded, onclose }: { onadded?: () => void; onclose?: () => void } =
    $props();

  let showPin = $state(false);

  const form = useForm<PinForm>(
    pinSchema,
    { name: "", pin: "", notes: "" },
    async (values) => {
      await addPin(
        values.name.trim(),
        values.pin.trim(),
        values.notes?.trim() || "",
      );
      onadded?.();
      onclose?.();
    },
  );
</script>

<Modal show={true} {onclose} title={$_("pin_security.new_pin")}>
  <form
    id="add-pin-form"
    class="flex flex-col gap-4"
    onsubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}
  >
    <Input
      id="pin-name"
      label={$_("pin_security.name_label")}
      bind:value={form.values.name}
      placeholder={$_("pin_security.name_placeholder")}
      autocomplete="off"
      autofocus
      error={form.errors.name
        ? $_(`pin_security.${form.errors.name}`)
        : undefined}
    />

    <Input
      id="pin-code"
      label={$_("pin_security.pin_label")}
      variant="double"
      type={showPin ? "text" : "password"}
      bind:value={form.values.pin}
      placeholder={$_("pin_security.pin_placeholder")}
      autocomplete="new-password"
      error={form.errors.pin
        ? $_(`pin_security.${form.errors.pin}`)
        : undefined}
    >
      {#snippet action()}
        <IconButton
          size="sm"
          onclick={() => (showPin = !showPin)}
          label={showPin ? $_("actions.hide") : $_("actions.show")}
        >
          {#if showPin}
            <IconEyeOff size={18} />
          {:else}
            <IconEye size={18} />
          {/if}
        </IconButton>
      {/snippet}
    </Input>

    <Textarea
      id="pin-notes"
      label={$_("pin_security.notes_label")}
      bind:value={form.values.notes}
      placeholder={$_("pin_security.notes_placeholder")}
      rows={3}
    />

    {#if form.globalError}
      <p
        class="text-danger text-xs py-2 px-3 bg-danger/10 border border-danger/20 rounded-md"
      >
        {form.globalError}
      </p>
    {/if}
  </form>

  {#snippet footer()}
    <Button variant="ghost" onclick={onclose}>
      {$_("actions.cancel")}
    </Button>
    <Button
      type="submit"
      form="add-pin-form"
      disabled={form.loading}
      class="min-w-24"
    >
      {#if form.loading}
        <span
          class="w-3 h-3 border-2 border-surface/30 border-t-white rounded-full animate-spin mr-1.5"
        ></span>
        {$_("actions.status.saving")}
      {:else}
        {$_("actions.save")}
      {/if}
    </Button>
  {/snippet}
</Modal>
