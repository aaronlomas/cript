<script lang="ts">
  import { _ } from "svelte-i18n";
  import { dataState } from "$lib/stores/stores.svelte";
  import { updateAccountGroup, updatePinGroup, saveGroups } from "$lib/utils/tauri";
  import { toast } from "$lib/stores/toast.svelte";
  import { IconPlus, IconCheck } from "@tabler/icons-svelte";
  import { focus } from "$lib/utils/actions";
  import Modal from "../../core/primitives/Modal.svelte";
  import Button from "../../core/primitives/Button.svelte";
  import Chip from "../../core/primitives/Chip.svelte";
  import IconButton from "../../core/primitives/IconButton.svelte";

  // ── Props ──────────────────────────────────────────────────────────────────
  let {
    accountId,
    itemType = "account",
    currentGroup,
    onassigned,
    onclose,
  }: {
    accountId: string;
    itemType?: "account" | "pin";
    currentGroup?: string | null;
    onassigned?: () => void;
    onclose: () => void;
  } = $props();

  // ── State ──────────────────────────────────────────────────────────────────
  let selected = $state<string | null>(null);
  let newGroupName = $state("");
  let showNewInput = $state(false);
  let saving = $state(false);

  // Keep state in sync with prop and fix "state_referenced_locally"
  $effect(() => {
    selected = currentGroup ?? null;
  });

  // ── Actions ────────────────────────────────────────────────────────────────

  async function handleSave(): Promise<void> {
    saving = true;
    try {
      if (itemType === "pin") {
        await updatePinGroup(accountId, selected);
      } else {
        await updateAccountGroup(accountId, selected);
      }
      onassigned?.();
      toast.success($_("groups.assigned_success"));
      onclose();
    } catch (e) {
      console.error(e);
      toast.error($_("groups.assigned_error"));
    } finally {
      saving = false;
    }
  }

  async function handleAddGroup(): Promise<void> {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;
    if (dataState.groups.includes(trimmed)) {
      selected = trimmed;
      showNewInput = false;
      newGroupName = "";
      return;
    }
    const updated = [...dataState.groups, trimmed];
    await saveGroups(updated);
    dataState.groups = updated;
    selected = trimmed;
    showNewInput = false;
    newGroupName = "";
  }
</script>

<Modal 
  show={true} 
  onclose={onclose} 
  title={$_("groups.modal_title")}
>
  <div class="space-y-4">
    <p class="text-xs text-text-muted">{$_("groups.pick_a_group")}</p>

    <div class="flex flex-wrap gap-2">
      {#each dataState.groups as group (group)}
        <Chip
          active={selected === group}
          onclick={() => (selected = group)}
        >
          {#if selected === group}
            <span class="inline-flex items-center gap-1">
              <IconCheck size={11} />
              {group}
            </span>
          {:else}
            {group}
          {/if}
        </Chip>
      {/each}

      <!-- Add new group button / input -->
      {#if showNewInput}
        <div class="flex items-center gap-1">
          <input
            class="p-2 rounded-full text-xs bg-surface/10 border border-accent/40 text-text-primary focus:outline-none focus:border-accent w-28"
            bind:value={newGroupName}
            placeholder={$_("groups.new_group_placeholder")}
            use:focus
            onkeydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddGroup();
              }
              if (e.key === "Escape") {
                showNewInput = false;
                newGroupName = "";
              }
            }}
          />
          <IconButton
            size="sm"
            variant="primary"
            onclick={handleAddGroup}
            label={$_("groups.confirm_new_group")}
            class="rounded-full"
          >
            <IconCheck size={11} />
          </IconButton>
        </div>
      {:else}
        <Chip
          shape="full"
          class="border-dashed"
          onclick={() => (showNewInput = true)}
        >
          <IconPlus size={11} />
          {$_("groups.new_group")}
        </Chip>
      {/if}
    </div>
  </div>

  {#snippet footer()}
    <Button variant="ghost" onclick={onclose}>
      {$_("actions.cancel")}
    </Button>
    <Button 
      onclick={handleSave} 
      disabled={saving}
      class="min-w-24"
    >
      {saving ? $_("actions.status.saving") : $_("actions.save")}
    </Button>
  {/snippet}
</Modal>
