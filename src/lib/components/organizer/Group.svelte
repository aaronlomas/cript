<script lang="ts">
  /**
   * @component Group
   * @description Component to filter items by group and manage tags/groups.
   */
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import {
    IconPlus,
    IconCheck,
    IconX,
    IconPencil,
    IconTrash,
    IconLock,
    IconLockOpen,
  } from "@tabler/icons-svelte";
  import { uiState, dataState } from "$lib/stores/stores.svelte";
  import { useGroups } from "$lib/composables/useGroups.svelte";
  import GroupColorPicker from "$lib/components/organizer/groupColors/GroupColorPicker.svelte";
  import Chip from "$lib/components/core/primitives/Chip.svelte";
  import IconButton from "$lib/components/core/primitives/IconButton.svelte";
  import { focus, selectOnFocus } from "$lib/utils/actions";
  import { modal } from "$lib/stores/modal.svelte";

  // ── Composable and Initialization
  const groupService = useGroups();

  /**
   * Locks capsules directly. Unlocking requires master password verification.
   */
  async function toggleCapsuleLock() {
    if (!uiState.capsuleLocked) {
      uiState.capsuleLocked = true;
      return;
    }
    const confirmed = await modal.openVerifyMaster();
    if (confirmed) {
      uiState.capsuleLocked = false;
    }
  }

  let editingGroup = $state<string | null>(null); // editing group
  let editingValue = $state(""); // current rename input value
  let editingColor = $state<string | null>(null); // current rename color
  let addingGroup = $state(false); // new group input visibility
  let newGroupName = $state(""); // new group input value
  let newGroupColor = $state<string | null>(null); // new group color

  // ── Handlers
  // ── Group Management ───────────────────────────────────────────────────────────────
  async function handleAddGroup(): Promise<void> {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;
    await groupService.add(trimmed, newGroupColor);
    newGroupName = "";
    newGroupColor = null;
    addingGroup = false;
  }

  function startRename(group: string): void {
    editingGroup = group;
    editingValue = group;
    editingColor = dataState.groupColors[group] || null;
  }

  async function confirmRename(): Promise<void> {
    if (!editingGroup) return;
    await groupService.rename(editingGroup, editingValue, editingColor);
    cancelRename();
  }

  function cancelRename(): void {
    editingGroup = null;
    editingValue = "";
    editingColor = null;
  }

  onMount(() => {
    groupService.refresh();
  });
</script>

<!-- Filter by group  -->

<div class="flex flex-wrap items-center gap-2 mb-6">
  <!-- All -->
  <Chip
    active={uiState.activeGroup === null}
    onclick={() => (uiState.activeGroup = null)}
  >
    {$_("groups.all")}
  </Chip>

  {#each groupService.groups as group (group)}
    <div class="relative group/chip flex items-center">
      {#if editingGroup === group}
        <!-- Rename input -->
        <div
          class="flex items-center py-0.5 px-2 rounded-full border border-accent/50 bg-surface/10"
        >
          <input
            class="text-xs bg-transparent text-text-primary focus:outline-none w-24 leading-none"
            bind:value={editingValue}
            onkeydown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmRename();
              }
              if (e.key === "Escape") cancelRename();
            }}
            use:selectOnFocus
          />
          <IconButton
            size="sm"
            variant="accent"
            onclick={confirmRename}
            label={$_("groups.confirm_rename")}
          >
            <IconCheck size={14} />
          </IconButton>
          <IconButton
            size="sm"
            variant="default"
            onclick={cancelRename}
            label={$_("actions.cancel")}
          >
            <IconX size={14} />
          </IconButton>
          <GroupColorPicker bind:selectedColor={editingColor} />
        </div>
      {:else}
        <!-- User-created group -->
        <!-- --------- -->
        <!-- | Group | -->
        <!-- --------- -->
        <Chip
          active={uiState.activeGroup === group}
          onclick={() =>
            (uiState.activeGroup =
              uiState.activeGroup === group ? null : group)}
        >
          <span class="flex items-center leading-none gap-1">
            {#if dataState.groupColors[group]}
              <span
                class="size-2 rounded-full"
                style="background-color: {dataState.groupColors[group]};"
              ></span>
            {/if}
            <!-- text for groups already created -->
            {group}
          </span>
        </Chip>
        <!-- Edit / delete group buttons -->
        <div
          class="absolute -right-1 -top-4 hidden group-hover/chip:flex items-center bg-panel backdrop-blur-sm border border-surface/15 rounded-full shadow-sm z-10"
        >
          <IconButton
            size="sm"
            variant="accent"
            onclick={() => startRename(group)}
            label={$_("actions.rename")}
            title={$_("actions.rename")}
          >
            <IconPencil size={10} />
          </IconButton>
          <IconButton
            size="sm"
            variant="danger"
            onclick={() => groupService.delete(group)}
            label={$_("groups.delete")}
            title={$_("groups.delete")}
          >
            <IconTrash size={10} />
          </IconButton>
        </div>
      {/if}
    </div>
  {/each}

  <!-- Add group button / input -->
  {#if addingGroup}
    <div
      class="flex items-center px-2 py-0.5 rounded-full border border-accent/40 bg-surface/8"
    >
      <input
        class="text-xs bg-transparent text-text-primary focus:outline-none w-24 placeholder:text-text-muted"
        bind:value={newGroupName}
        placeholder={$_("groups.new_group_placeholder")}
        use:focus
        onkeydown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddGroup();
          }
          if (e.key === "Escape") {
            addingGroup = false;
            newGroupName = "";
          }
        }}
      />
      <IconButton
        size="sm"
        variant="accent"
        onclick={handleAddGroup}
        label={$_("groups.confirm_new_group")}
      >
        <IconCheck size={14} />
      </IconButton>
      <IconButton
        size="sm"
        variant="default"
        onclick={() => {
          addingGroup = false;
          newGroupName = "";
          newGroupColor = null;
        }}
        label={$_("actions.cancel")}
      >
        <IconX size={14} />
      </IconButton>
      <GroupColorPicker bind:selectedColor={newGroupColor} />
    </div>
  {:else}
    <Chip
      shape="full"
      class="border-dashed"
      onclick={() => (addingGroup = true)}
    >
      <IconPlus size={11} />
      {$_("groups.new_group")}
    </Chip>
  {/if}

  <IconButton
    size="md"
    variant="default"
    active={uiState.capsuleLocked}
    onclick={toggleCapsuleLock}
    label={uiState.capsuleLocked
      ? $_("actions.lock_capsule_label")
      : $_("actions.unlock_capsule_label")}
    title={uiState.capsuleLocked
      ? $_("actions.lock_capsule_label")
      : $_("actions.unlock_capsule_label")}
    class="rounded-full border border-surface/15 hover:border-accent/50"
  >
    {#if uiState.capsuleLocked}
      <IconLock size={14} />
    {:else}
      <IconLockOpen size={14} />
    {/if}
  </IconButton>
</div>
