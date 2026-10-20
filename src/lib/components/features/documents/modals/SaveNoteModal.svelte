<script lang="ts">
  import { _ } from "svelte-i18n";
  import { useForm } from "$lib/validation/useForm.svelte";
  import { noteSchema, type NoteForm } from "$lib/validation/schemas";
  import Modal from "../../../core/primitives/Modal.svelte";
  import Button from "../../../core/primitives/Button.svelte";
  import Input from "../../../core/primitives/Input.svelte";
  import Textarea from "../../../core/primitives/Textarea.svelte";

  let {
    onclose,
    onsave,
  }: {
    onclose: () => void;
    onsave: (title: string, description: string) => void;
  } = $props();

  const form = useForm<NoteForm>(
    noteSchema,
    { title: "", description: "" },
    async (values) => {
      onsave(values.title, values.description || "");
    },
  );
</script>

<Modal show={true} {onclose} title={$_("documents.save_note_title")}>
  <div class="space-y-6">
    <form
      id="save-note-form"
      class="space-y-4"
      onsubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Input
        id="note-title"
        label={$_("documents.note_title_label")}
        bind:value={form.values.title}
        placeholder={$_("documents.note_title_placeholder")}
        autofocus
        error={form.errors.title
          ? $_("documents.error_title_required")
          : undefined}
      />

      <Textarea
        id="note-desc"
        label={$_("documents.note_desc_label")}
        bind:value={form.values.description}
        placeholder={$_("documents.note_desc_placeholder")}
        rows={3}
        class="resize-none"
      />

      {#if form.globalError}
        <p
          class="text-danger text-xs bg-danger/10 p-3 rounded-lg border border-danger/20"
        >
          {form.globalError}
        </p>
      {/if}
    </form>
  </div>

  {#snippet footer()}
    <Button variant="ghost" onclick={onclose}>
      {$_("actions.cancel")}
    </Button>
    <Button
      type="submit"
      form="save-note-form"
      disabled={form.loading}
      class="min-w-32"
    >
      {#if form.loading}
        <span
          class="w-3.5 h-3.5 border-2 border-surface/30 border-t-white rounded-full animate-spin mr-2"
        ></span>
        {$_("actions.status.saving")}
      {:else}
        {$_("actions.save")}
      {/if}
    </Button>
  {/snippet}
</Modal>
