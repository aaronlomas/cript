<script lang="ts">
  /**
   * @component CredentialHeader
   * @description Credential card header.
   * Renders the site favicon/initial, the assigned group, and manages the contextual actions menu.
   */
  import { _ } from "svelte-i18n";
  import {
    IconDotsVertical,
    IconFolderPlus,
    IconFolderX,
    IconTrash,
  } from "@tabler/icons-svelte";
  import { dataState, type Account } from "$lib/stores/stores.svelte";
  import { modal } from "$lib/stores/modal.svelte";
  import { updateAccountGroup } from "$lib/utils/tauri";
  import { toast } from "$lib/stores/toast.svelte";
  import IconButton from "$lib/components/core/primitives/IconButton.svelte";
  import Menu from "$lib/components/core/primitives/Menu.svelte";
  import MenuItem from "$lib/components/core/primitives/MenuItem.svelte";
  import MenuSeparator from "$lib/components/core/primitives/MenuSeparator.svelte";

  // Props
  interface Props {
    account: Account;
    ondelete: () => void;
    onrefresh?: () => void;
    expanded?: boolean;
  }

  let {
    account,
    ondelete,
    onrefresh,
    expanded = false,
  }: Props = $props();

  // Local state for controlling the opening of the context menu
  let menuOpen = $state(false);

  // RENDER HELPERS
  /**
   * Gets the initial letter of the website cleaning common protocols and subdomains.
   */
  function getSiteInitial(site: string): string {
    return site
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .charAt(0)
      .toUpperCase();
  }

  // ACTION FLOWS AND CONTEXT MENU
  /**
   * Opens the asynchronous modal to assign or change the account group.
   */
  async function openAssignGroup(): Promise<void> {
    menuOpen = false;
    const assigned = await modal.openAssignGroup({
      accountId: account.id,
      currentGroup: account.group_name,
    });
    if (assigned) onrefresh?.();
  }

  /**
   * Removes the account from its current group safely in the local database.
   */
  async function removeFromGroup(): Promise<void> {
    menuOpen = false;
    try {
      await updateAccountGroup(account.id, null);
      onrefresh?.();
      toast.success($_("groups.removed_success"));
    } catch (e) {
      console.error(e);
      toast.error($_("groups.removed_error"));
    }
  }
</script>

<!-- GLOBAL WINDOW EVENTS -->


<div class="flex items-center gap-2">
  <!-- Favicon -->
  <div
    class="w-11 h-11 rounded-sm grid place-items-center shrink-0 text-lg font-bold relative {!(
      account.group_name && dataState.groupColors[account.group_name]
    )
      ? 'bg-surface/5 border border-surface/10 text-text-primary'
      : 'text-white border border-transparent'}"
    style={account.group_name && dataState.groupColors[account.group_name]
      ? `background-color: ${dataState.groupColors[account.group_name]}; border-color: ${dataState.groupColors[account.group_name]}; box-shadow: 0 0 10px ${dataState.groupColors[account.group_name]}40;`
      : ""}
  >
    {#if account.favicon_url}
      <img
        src={account.favicon_url}
        alt={account.site}
        onerror={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
        class="absolute inset-0 w-full h-full object-contain p-2 rounded-inherit"
      />
    {/if}
    <span class="initial">{getSiteInitial(account.site)}</span>
  </div>

  <!-- Site and Group Information -->
  <div class="flex-1 min-w-0">
    <span
      class="block font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis"
      >{account.site}</span
    >
    <span class="text-text-muted text-xs"
      >{account.group_name || $_("groups.none")}</span
    >
  </div>

  <!-- More Actions Button -->
  <div class="flex items-center shrink-0">
    <div class="relative">
      <IconButton
        size="sm"
        active={menuOpen}
        disabled={!expanded}
        onclick={() => {
          if (expanded) menuOpen = !menuOpen;
        }}
        label={$_("groups.menu_label")}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        class={expanded ? "" : "opacity-50"}
      >
        <IconDotsVertical size={16} />
      </IconButton>

      {#if menuOpen}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="fixed inset-0 z-10"
          onclick={() => (menuOpen = false)}
        ></div>
      {/if}

      <Menu open={menuOpen}>
        <MenuItem onclick={openAssignGroup}>
          <IconFolderPlus size={15} class="text-accent shrink-0" />
          {account.group_name
            ? $_("groups.change_group")
            : $_("groups.add_to_group")}
        </MenuItem>

        {#if account.group_name}
          <MenuItem onclick={removeFromGroup}>
            <IconFolderX size={15} class="text-text-muted shrink-0" />
            {$_("groups.remove_from_group")}
          </MenuItem>
        {/if}

        <MenuSeparator />

        <MenuItem
          variant="danger"
          onclick={() => {
            menuOpen = false;
            ondelete();
          }}
        >
          <IconTrash size={15} class="shrink-0" />
          {$_("actions.delete")}
        </MenuItem>
      </Menu>
    </div>
  </div>
</div>
