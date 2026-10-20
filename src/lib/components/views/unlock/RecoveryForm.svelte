<script lang="ts">
  import { _ } from "svelte-i18n";
  import { IconArrowLeft } from "@tabler/icons-svelte";
  import Input from "../../core/primitives/Input.svelte";
  import Button from "../../core/primitives/Button.svelte";

  interface Props {
    recoveryCode: string;
    recoverySuccess: boolean;
    oncancel: () => void;
  }

  let {
    recoveryCode = $bindable(),
    recoverySuccess,
    oncancel,
  }: Props = $props();
</script>

<div class="flex flex-col gap-1.5 animate-in fade-in slide-in-from-right-4">
  {#if !recoverySuccess}
    <Input
      id="recovery-unlock"
      label={$_("settings.security.totp_recovery_title")}
      type="text"
      maxlength={24}
      bind:value={recoveryCode}
      placeholder={$_("settings.security.totp_recovery_placeholder")}
      disabled={recoverySuccess}
      autofocus
      inputClass="text-center text-lg font-mono tracking-tight"
    />

    <Button
      variant="ghost"
      size="sm"
      onclick={oncancel}
      class="gap-1 self-start mt-2"
    >
      <IconArrowLeft size={14} />
      {$_("settings.security.totp_back_to_password")}
    </Button>
  {/if}
</div>
