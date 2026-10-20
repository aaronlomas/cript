<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    IconLock,
    IconEye,
    IconEyeOff,
    IconDownload,
  } from "@tabler/icons-svelte";
  import Modal from "../../../core/primitives/Modal.svelte";
  import Button from "../../../core/primitives/Button.svelte";
  import Input from "../../../core/primitives/Input.svelte";
  import IconButton from "../../../core/primitives/IconButton.svelte";

  import { invoke } from "@tauri-apps/api/core";
  import { save } from "@tauri-apps/plugin-dialog";
  import { toast } from "$lib/stores/toast.svelte";
  import { get } from "svelte/store";

  interface Props {
    onconfirm: (password: string) => void;
    oncancel: () => void;
    customWarning?: string;
    customTitle?: string;
  }

  let { onconfirm, oncancel, customWarning, customTitle }: Props = $props();

  let password = $state("");
  let showPassword = $state(false);
  let error = $state("");
  let loading = $state(false);

  async function handleExportSecure() {
    const t = get(_);
    loading = true;
    try {
      const filePath = await save({
        title: t("export_pack.title"),
        defaultPath: "Cript_Export.crp.pack",
        filters: [
          { name: "Cript Secure Package", extensions: ["pack", "crp.pack"] },
        ],
      });

      if (filePath) {
        await invoke("export_secure_package", {
          destPath: filePath,
          password: password,
        });
        toast.success(t("export_pack.success", { values: { path: filePath } }));
        onconfirm(password);
      }
    } catch (e: any) {
      console.error("Export failed:", e);
      toast.error(t("export_pack.error") + ": " + e.toString());
    } finally {
      loading = false;
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (password.length < 8) {
      error = $_("export_pack.password_error");
      return;
    }
    handleExportSecure();
  }
</script>

<Modal
  show={true}
  onclose={oncancel}
  title={customTitle || $_("export_pack.title")}
>
  <div class="space-y-6">
    <div class="bg-accent/5 border border-accent/10 rounded-xl p-4">
      <p class="text-xs text-text-secondary leading-relaxed">
        {customWarning || $_("export_pack.warning")}
      </p>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4" id="export-form">
      <Input
        id="export-pw"
        label={$_("export_pack.password_label")}
        variant="triple"
        type={showPassword ? "text" : "password"}
        bind:value={password}
        placeholder="••••••••••••"
        required
        autofocus
        {error}
      >
        {#snippet icon()}
          <IconLock size={18} class="text-text-muted" />
        {/snippet}

        {#snippet action()}
          <IconButton
            size="sm"
            onclick={() => (showPassword = !showPassword)}
            label={showPassword ? $_("actions.hide") : $_("actions.show")}
          >
            {#if showPassword}
              <IconEyeOff size={18} />
            {:else}
              <IconEye size={18} />
            {/if}
          </IconButton>
        {/snippet}
      </Input>
    </form>
  </div>

  {#snippet footer()}
    <Button variant="ghost" onclick={oncancel}>
      {$_("actions.cancel")}
    </Button>
    <Button type="submit" form="export-form" class="gap-2" disabled={loading}>
      {#if loading}
        <span
          class="w-3 h-3 border-2 border-surface/30 border-t-white rounded-full animate-spin mr-1.5"
        ></span>
        {$_("actions.status.encrypting")}
      {:else}
        <IconDownload size={18} />
        {$_("actions.export")}
      {/if}
    </Button>
  {/snippet}
</Modal>
