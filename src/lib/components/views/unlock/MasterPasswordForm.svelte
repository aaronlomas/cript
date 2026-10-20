<script lang="ts">
  import { _ } from "svelte-i18n";
  import { IconEye, IconEyeOff } from "@tabler/icons-svelte";
  import Input from "../../core/primitives/Input.svelte";
  import IconButton from "../../core/primitives/IconButton.svelte";
  import PasswordStrength from "../../features/accounts/forms/PasswordStrength.svelte";

  interface Props {
    password: string;
    confirmPassword: string;
    isNew: boolean;
    cooldown: number;
  }

  let {
    password = $bindable(),
    confirmPassword = $bindable(),
    isNew,
    cooldown,
  }: Props = $props();

  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
</script>

<Input
  id="master-pw"
  label={$_("unlock_screen.master_password_label")}
  variant="double"
  type={showPassword ? "text" : "password"}
  bind:value={password}
  placeholder={$_("unlock_screen.placeholder")}
  autocomplete="current-password"
  disabled={cooldown > 0}
  autofocus
  class={cooldown > 0 ? "opacity-50 grayscale" : ""}
>
  {#snippet action()}
    <IconButton
      size="empty"
      onclick={() => (showPassword = !showPassword)}
      disabled={cooldown > 0}
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

{#if isNew}
  <div class="flex flex-col gap-1 mt-2">
    <Input
      id="confirm-pw"
      label={$_("unlock_screen.confirm_password_label")}
      variant="double"
      type={showConfirmPassword ? "text" : "password"}
      bind:value={confirmPassword}
      placeholder={$_("unlock_screen.placeholder")}
    >
      {#snippet action()}
        <IconButton
          size="empty"
          onclick={() => (showConfirmPassword = !showConfirmPassword)}
          label={showConfirmPassword ? $_("actions.hide") : $_("actions.show")}
        >
          {#if showConfirmPassword}
            <IconEyeOff size={18} />
          {:else}
            <IconEye size={18} />
          {/if}
        </IconButton>
      {/snippet}
    </Input>
    <div class="px-2">
      <PasswordStrength {password} />
    </div>
  </div>
{/if}
