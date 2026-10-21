<script lang="ts">
  import {
    themeStore,
    type ColorScheme,
  } from "$lib/stores/theme.svelte";
  import Card from "$lib/components/core/primitives/Card.svelte";
  import {
    IconSun,
    IconMoon,
    IconDeviceDesktop,
  } from "@tabler/icons-svelte";
  import { _ } from "svelte-i18n";

  async function handleColorSchemeChange(scheme: ColorScheme) {
    await themeStore.setColorScheme(scheme);
  }
</script>

<div class="grid gap-6">
  <!-- Appearance Mode Section -->
  <div class="space-y-3">
    <div>
      <h3 class="text-sm font-bold text-text-primary">
        {$_("settings.theme.appearance")}
      </h3>
      <p class="text-xs text-text-muted">
        {$_("settings.theme.appearance_desc")}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        title={$_("settings.theme.mode_light")}
        icon={IconSun}
        active={themeStore.colorScheme === "light"}
        onclick={() => handleColorSchemeChange("light")}
      />

      <Card
        title={$_("settings.theme.mode_dark")}
        icon={IconMoon}
        active={themeStore.colorScheme === "dark"}
        onclick={() => handleColorSchemeChange("dark")}
      />

      <Card
        title={$_("settings.theme.mode_system")}
        icon={IconDeviceDesktop}
        active={themeStore.colorScheme === "system"}
        onclick={() => handleColorSchemeChange("system")}
      />
    </div>
  </div>
</div>
