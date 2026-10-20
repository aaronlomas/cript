<script lang="ts">
  import { _ } from "svelte-i18n";
  import { IconEye, IconEyeOff } from "@tabler/icons-svelte";
  import PasswordStrength from "./PasswordStrength.svelte";
  import PasswordGenerator from "./PasswordGenerator.svelte";
  import Input from "../../core/primitives/Input.svelte";
  import Textarea from "../../core/primitives/Textarea.svelte";
  import Button from "../../core/primitives/Button.svelte";
  import IconButton from "../../core/primitives/IconButton.svelte";

  interface Props {
    site?: string;
    username?: string;
    password?: string;
    recoveryCode?: string;
    notes?: string;
    errors?: Record<string, string>;
  }

  let {
    site = $bindable(""),
    username = $bindable(""),
    password = $bindable(""),
    recoveryCode = $bindable(""),
    notes = $bindable(""),
    errors = {},
  }: Props = $props();

  let showPw = $state(false);
  let showGenerator = $state(false);
</script>

<div class="flex flex-col gap-4">
  <!-- Site -->
  <Input
    id="add-site"
    label={$_("add_credential.site_label")}
    bind:value={site}
    placeholder={$_("add_credential.site_placeholder")}
    error={errors.site ? $_(`add_credential.${errors.site}`) : undefined}
  />

  <!-- Username -->
  <Input
    id="add-user"
    label={$_("add_credential.user_label")}
    bind:value={username}
    placeholder={$_("add_credential.user_placeholder")}
    autocomplete="off"
    error={errors.username
      ? $_(`add_credential.${errors.username}`)
      : undefined}
  />

  <!-- Password -->
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <label for="add-pw" class="text-sm font-medium text-text-secondary">
        {$_("add_credential.password_label")}
      </label>
      <Button
        variant="link"
        class="text-xs"
        onclick={() => (showGenerator = !showGenerator)}
      >
        {showGenerator ? $_("actions.hide") : $_("actions.generate")}
      </Button>
    </div>

    {#snippet eyeAction()}
      <IconButton
        size="empty"
        onclick={() => (showPw = !showPw)}
        label={showPw ? $_("actions.hide") : $_("actions.show")}
      >
        {#if showPw}
          <IconEyeOff size={18} />
        {:else}
          <IconEye size={18} />
        {/if}
      </IconButton>
    {/snippet}

    <Input
      id="add-pw"
      variant="double"
      action={eyeAction}
      type={showPw ? "text" : "password"}
      bind:value={password}
      placeholder={$_("add_credential.placeholder")}
      autocomplete="new-password"
      error={errors.password
        ? $_(`add_credential.${errors.password}`)
        : undefined}
    />

    <PasswordStrength {password} />

    {#if showGenerator}
      <PasswordGenerator
        onuse={(pw) => {
          password = pw;
          showGenerator = false;
        }}
      />
    {/if}
  </div>

  <!-- Recovery Code -->
  <Input
    id="add-recovery"
    label={$_("add_credential.recovery_code_label")}
    bind:value={recoveryCode}
    placeholder={$_("add_credential.recovery_code_placeholder")}
    autocomplete="off"
  />

  <!-- Notes -->
  <Textarea
    id="add-notes"
    label={$_("add_credential.notes_label")}
    bind:value={notes}
    placeholder={$_("add_credential.notes_placeholder")}
    rows={3}
  />
</div>
