<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    IconInfoCircle,
    IconAlertTriangle,
    IconTrash,
    IconEye,
    IconEyeOff,
    IconLock,
  } from "@tabler/icons-svelte";
  import { invoke } from "@tauri-apps/api/core";
  import Button from "../../../core/primitives/Button.svelte";
  import Modal from "../../../core/primitives/Modal.svelte";
  import ListItem from "../../../core/primitives/ListItem.svelte";
  import Input from "../../../core/primitives/Input.svelte";
  import { toast } from "$lib/stores/toast.svelte";
  import { sessionState } from "$lib/stores/stores.svelte";
  import { check, type Update } from "@tauri-apps/plugin-updater";

  let showDeleteConfirm = $state(false);
  let password = $state("");
  let showPassword = $state(false);
  let loadingDelete = $state(false);
  let errorDelete = $state("");

  let updateState = $state<
    "idle" | "checking" | "available" | "downloading" | "done"
  >("idle");
  let updateData = $state<Update | null>(null);

  async function handleDeleteVault(e: SubmitEvent) {
    e.preventDefault();
    if (!password) {
      errorDelete = $_("validations.is_required");
      return;
    }
    loadingDelete = true;
    errorDelete = "";
    try {
      await invoke("delete_vault", { password });
      toast.success($_("settings.account_system.delete_success"));
      showDeleteConfirm = false;
      sessionState.isUnlocked = false; // Redirects to login
    } catch (e: any) {
      errorDelete = e.toString();
    } finally {
      loadingDelete = false;
    }
  }

  async function handleUpdater() {
    if (updateState === "idle") {
      updateState = "checking";
      try {
        const update = await check();
        if (update) {
          updateData = update;
          updateState = "available";
        } else {
          toast.success($_("settings.updater.update_status"));
          updateState = "idle";
        }
      } catch (err) {
        console.error(err);
        toast.error($_("settings.updater.update_error"));
        updateState = "idle";
      }
    } else if (updateState === "available" && updateData) {
      updateState = "downloading";
      try {
        await updateData.downloadAndInstall();
        updateState = "done";
        toast.success($_("settings.updater.update_ready"));
      } catch (err: any) {
        console.error("Update error:", err);
        // Fallback for unsupported platforms (like .deb on Linux)
        if (err.toString().toLowerCase().includes("unsupported")) {
          toast.info($_("settings.updater.linux_apt_install"));
        } else {
          toast.error(
            $_("settings.updater.update_failed", {
              values: { error: err.toString() },
            }),
          );
        }
        updateState = "idle";
      }
    }
  }
</script>

<div class="grid gap-4">
  <!-- About: Title and description -->

  <div>
    <h2 class="text-xl font-bold text-text-primary flex items-center gap-2">
      <IconInfoCircle class="text-accent" />
      {$_("settings.system.title")}
    </h2>
    <p class="text-text-muted text-xs mt-1">
      {$_("settings.system.desc")}
    </p>
  </div>

  <!-- updater -->

  <h1 class="text-text-primary text-xl font-bold border-b border-surface/8">
    {$_("settings.updater.title")}
  </h1>
  <ListItem layout="double" flush={true}>
    <div>
      <p class="text-sm">{$_("settings.updater.sub_title")}</p>
      <p class="text-xs text-text-muted">
        {#if updateState === "available" && updateData}
          {$_("settings.updater.version_available", {
            values: { version: updateData.version },
          })}
        {:else}
          {$_("settings.updater.desc")}
        {/if}
      </p>
    </div>
    <Button
      variant={updateState === "available" ? "primary" : "secondary"}
      onclick={handleUpdater}
      disabled={updateState === "checking" ||
        updateState === "downloading" ||
        updateState === "done"}
    >
      {#if updateState === "idle"}
        {$_("actions.search")}
      {:else if updateState === "checking"}
        <span
          class="w-3 h-3 border-2 border-text-primary/30 border-t-text-primary rounded-full animate-spin mr-1.5"
        ></span>
        {$_("settings.updater.checking")}
      {:else if updateState === "available"}
        {$_("actions.update")}
      {:else if updateState === "downloading"}
        <span
          class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5"
        ></span>
        {$_("settings.updater.updating")}
      {:else if updateState === "done"}
        {$_("settings.updater.ready")}
      {/if}
    </Button>
  </ListItem>

  <!-- Account System -->

  <h1 class="text-text-primary text-xl font-bold border-b border-surface/8">
    {$_("settings.account_system.title")}
  </h1>
  <ListItem layout="double" flush={true}>
    <div>
      <h3 class="text-sm font-medium text-danger">
        {$_("settings.account_system.delete_account")}
      </h3>
      <p class="text-xs text-text-muted">
        {$_("settings.account_system.delete_account_desc")}
      </p>
    </div>
    <Button variant="danger" onclick={() => (showDeleteConfirm = true)}>
      {$_("actions.delete")}
    </Button>
  </ListItem>
</div>

{#if showDeleteConfirm}
  <Modal
    show={true}
    onclose={() => (showDeleteConfirm = false)}
    title={$_("settings.account_system.delete_account")}
  >
    <div class="space-y-6">
      <div
        class="bg-danger/10 border border-danger/20 rounded-xl p-4 flex gap-3"
      >
        <IconAlertTriangle class="text-danger shrink-0" size={20} />
        <p class="text-xs text-danger/90 leading-relaxed">
          {$_("settings.account_system.delete_confirm")}
        </p>
      </div>

      <form
        id="delete-vault-form"
        onsubmit={handleDeleteVault}
        class="space-y-4"
      >
        <div class="space-y-2">
          <Input
            id="del-pw"
            type={showPassword ? "text" : "password"}
            label={$_("unlock_screen.master_password_label")}
            bind:value={password}
            variant="triple"
            required
            autofocus
          >
            {#snippet icon()}
              <IconLock size={18} class="text-text-muted" />
            {/snippet}
            {#snippet action()}
              <button
                type="button"
                class="text-text-muted hover:text-text-primary transition-colors flex items-center justify-center"
                onclick={() => (showPassword = !showPassword)}
              >
                {#if showPassword}
                  <IconEyeOff size={18} />
                {:else}
                  <IconEye size={18} />
                {/if}
              </button>
            {/snippet}
          </Input>
          {#if errorDelete}
            <p
              class="text-xs text-danger font-medium animate-in fade-in slide-in-from-top-1"
            >
              {errorDelete}
            </p>
          {/if}
        </div>
      </form>
    </div>

    {#snippet footer()}
      <Button variant="ghost" onclick={() => (showDeleteConfirm = false)}>
        {$_("actions.cancel")}
      </Button>
      <Button
        type="submit"
        form="delete-vault-form"
        variant="danger"
        disabled={loadingDelete}
      >
        {#if loadingDelete}
          <span
            class="w-3 h-3 border-2 border-danger/30 border-t-white rounded-full animate-spin mr-1.5"
          ></span>
          {$_("actions.status.deleting")}
        {:else}
          <IconTrash size={18} class="mr-1.5" />
          {$_("actions.delete")}
        {/if}
      </Button>
    {/snippet}
  </Modal>
{/if}
