<script lang="ts">
  import { _ } from "svelte-i18n";
  import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-svelte";
  import { invoke } from "@tauri-apps/api/core";
  import Modal from "../../core/primitives/Modal.svelte";
  import Button from "../../core/primitives/Button.svelte";
  import Input from "../../core/primitives/Input.svelte";
  import IconButton from "../../core/primitives/IconButton.svelte";

  let {
    onconfirm,
    oncancel,
  }: {
    onconfirm: () => void;
    oncancel: () => void;
  } = $props();

  let password = $state("");
  let showPassword = $state(false);
  let error = $state("");
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!password) return;

    loading = true;
    error = "";

    try {
      const valid = await invoke<boolean>("verify_master_password", { password });
      if (valid) {
        onconfirm();
      } else {
        error = $_("unlock_screen.error_incorrect");
        password = "";
      }
    } catch {
      error = $_("unlock_screen.error_incorrect");
      password = "";
    } finally {
      loading = false;
    }
  }
</script>

<Modal show={true} onclose={oncancel} title={$_("actions.unlock_capsule_label")}>
  <div class="space-y-6">
    <div class="bg-accent/5 border border-accent/10 rounded-xl p-4">
      <p class="text-xs text-text-secondary leading-relaxed">
        {$_("settings.security.verify_to_unlock")}
      </p>
    </div>

    <form onsubmit={handleSubmit} class="space-y-4" id="verify-master-form">
      <Input
        id="verify-master-pw"
        type={showPassword ? "text" : "password"}
        bind:value={password}
        placeholder="••••••••••••"
        required
        autofocus
        variant="triple"
        label={$_("unlock_screen.master_password_label")}
        error={error}
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
    <Button type="submit" form="verify-master-form" class="gap-2" disabled={loading}>
      {#if loading}
        <span class="w-3 h-3 border-2 border-surface/30 border-t-white rounded-full animate-spin mr-1.5"></span>
        {$_("actions.status.decryption")}
      {:else}
        <IconLock size={16} />
        {$_("actions.unlock_capsule_label")}
      {/if}
    </Button>
  {/snippet}
</Modal>
