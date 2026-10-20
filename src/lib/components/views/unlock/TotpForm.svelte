<script lang="ts">
  import { _ } from "svelte-i18n";
  import { IconArrowLeft } from "@tabler/icons-svelte";
  import Input from "../../core/primitives/Input.svelte";
  import Button from "../../core/primitives/Button.svelte";

  interface Props {
    totpCode: string;
    onreset: () => void;
  }

  let { totpCode = $bindable(), onreset }: Props = $props();
</script>

<div class="flex flex-col gap-1.5 animate-in fade-in slide-in-from-right-4">
  <Input
    id="totp-unlock"
    label={$_("settings.security.totp_verify_label")}
    type="text"
    maxlength={6}
    inputmode="numeric"
    autocomplete="one-time-code"
    bind:value={totpCode}
    placeholder="000000"
    autofocus
    inputClass="text-center text-lg font-mono tracking-[0.5em]"
  />

  <div class="flex items-center mt-2">
    <Button variant="ghost" size="sm" onclick={onreset} class="gap-1">
      <IconArrowLeft size={14} />
      {$_("settings.security.totp_back_to_password")}
    </Button>
  </div>
</div>
