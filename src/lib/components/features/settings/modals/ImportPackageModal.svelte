<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    IconLock,
    IconEye,
    IconEyeOff,
    IconDatabaseImport,
    IconCopy,
    IconReplace,
  } from "@tabler/icons-svelte";
  import Modal from "../../../core/primitives/Modal.svelte";
  import Button from "../../../core/primitives/Button.svelte";
  import Input from "../../../core/primitives/Input.svelte";
  import IconButton from "../../../core/primitives/IconButton.svelte";
  import ChoiceCard from "../../../core/primitives/ChoiceCard.svelte";

  import { open } from "@tauri-apps/plugin-dialog";
  import { invoke } from "@tauri-apps/api/core";
  import { toast } from "$lib/stores/toast.svelte";
  import { get } from "svelte/store";

  interface Props {
    onconfirm: (password: string, strategy: "merge" | "replace") => void;
    oncancel: () => void;
  }

  let { onconfirm, oncancel }: Props = $props();

  let password = $state("");
  let strategy = $state<"merge" | "replace">("merge");
  let showPassword = $state(false);
  let error = $state("");
  let loading = $state(false);

  async function handleImport() {
    const t = get(_);
    loading = true;
    try {
      const filePath = await open({
        title: t("import_pack.select_database"),
        filters: [
          {
            name: "Cript Vaults",
            extensions: ["crp", "db", "pack", "crp.pack"],
          },
        ],
      });

      if (!filePath) return;

      if (filePath.endsWith(".pack") || filePath.endsWith(".crp.pack")) {
        // Secure Package Import
        try {
          await invoke("import_secure_package", {
            srcPath: filePath,
            password: password,
            strategy: strategy,
          });
          toast.success(
            strategy === "replace"
              ? t("import_pack.success_replace")
              : t("import_pack.success_merge"),
          );
          onconfirm(password, strategy);
        } catch (e: any) {
          console.error("Secure import failed:", e);
          error = e.toString();
          toast.error("Error: " + e.toString());
        }
      } else {
        // Legacy DB Import (SQLite file replacement)
        try {
          await invoke("import_db", { srcPath: filePath });
          toast.success(t("import_pack.success_db"));
          onconfirm(password, strategy);
        } catch (e: any) {
          console.error("Import failed:", e);
          error = e.toString();
          toast.error("Error: " + e.toString());
        }
      }
    } catch (e: any) {
      console.error("Import selection failed:", e);
    } finally {
      loading = false;
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (password.length < 8) {
      error = $_("import_pack.password_error");
      return;
    }
    handleImport();
  }
</script>

<Modal show={true} onclose={oncancel} title={$_("import_pack.title")}>
  <div class="space-y-6">
    <form onsubmit={handleSubmit} class="space-y-6" id="import-form">
      <!-- Strategy Selection -->
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <ChoiceCard
            title={$_("import_pack.keep_both")}
            description={$_("import_pack.keep_both_desc")}
            icon={IconCopy}
            active={strategy === "merge"}
            onclick={() => (strategy = "merge")}
          />

          <ChoiceCard
            title={$_("actions.replace")}
            description={$_("import_pack.replace_desc")}
            icon={IconReplace}
            tone="danger"
            active={strategy === "replace"}
            onclick={() => (strategy = "replace")}
          />
        </div>
      </div>

      <!-- Password Field -->
      <Input
        id="import-pw"
        label={$_("import_pack.password_label")}
        variant="triple"
        type={showPassword ? "text" : "password"}
        bind:value={password}
        placeholder="••••••••••••"
        required
        autofocus
        error={error ? $_("import_pack.password_error") : undefined}
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
    <Button type="submit" form="import-form" class="gap-2" disabled={loading}>
      {#if loading}
        <span
          class="w-3 h-3 border-2 border-surface/30 border-t-white rounded-full animate-spin mr-1.5"
        ></span>
        {$_("actions.status.decryption")}
      {:else}
        <IconDatabaseImport size={18} />
        {$_("actions.import")}
      {/if}
    </Button>
  {/snippet}
</Modal>
