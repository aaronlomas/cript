<script lang="ts">
  import { _ } from "svelte-i18n";
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  import Logo from "$lib/components/ui/Logo.svelte";
  import {
    IconShieldCheck,
    IconCode,
    IconDatabase,
    IconBrandGithub,
    IconExternalLink,
    IconLicense,
  } from "@tabler/icons-svelte";

  let appInfo = $state({ app_version: "...", core_version: "..." });

  onMount(async () => {
    try {
      appInfo = await invoke("get_app_info");
    } catch (e) {
      console.error("Failed to fetch app info:", e);
    }
  });

  const links = [
    {
      label: $_("about_view.source_code"),
      href: "https://github.com/aaronlomas/cript",
    },
    {
      label: $_("about_view.releases"),
      href: "https://github.com/aaronlomas/cript/releases",
    },
    {
      label: $_("about_view.security_link"),
      href: "https://github.com/aaronlomas/cript/blob/main/SECURITY.md",
    },
    {
      label: $_("about_view.privacy_link"),
      href: "https://github.com/aaronlomas/cript/blob/main/PRIVACY.md",
    },
  ];
</script>

<div
  class="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10 h-full overflow-y-auto"
>
  <div class="mb-10 text-center">
    <div
      class="inline-flex items-center justify-center w-20 h-20 bg-accent/10 text-accent rounded-full mb-6 border border-accent/20 shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]"
    >
      <Logo size={40} class="text-accent" />
    </div>
    <h1 class="text-3xl font-bold text-text-primary mb-2">
      {$_("about_view.title")}
    </h1>
    <p class="text-text-muted text-lg">
      {$_("about_view.subtitle")}
    </p>
  </div>

  <div class="space-y-6">
    <!-- Versions -->
    <div
      class="p-6 bg-surface/4 backdrop-blur-2xl rounded-2xl border border-surface/8 shadow-xl"
    >
      <h3 class="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
        {$_("about_view.version_label")}
      </h3>
      <div class="flex flex-wrap gap-3">
        <div
          class="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-mono"
        >
          Cript v{appInfo.app_version}
        </div>
        <div
          class="px-4 py-2 rounded-xl bg-surface/5 border border-surface/8 text-text-secondary text-sm font-mono"
        >
          {$_("about_view.core_label")} v{appInfo.core_version}
        </div>
        <div
          class="px-4 py-2 rounded-xl bg-surface/5 border border-surface/8 text-text-secondary text-sm font-mono"
        >
          {$_("about_view.license_label")} · {$_("about_view.license_value")}
        </div>
      </div>
    </div>

    <!-- Card 1 -->
    <div
      class="p-6 bg-surface/4 backdrop-blur-2xl rounded-2xl border border-surface/8 shadow-xl flex gap-5 items-start transition-all hover:bg-surface/5"
    >
      <div
        class="w-12 h-12 rounded-xl bg-accent/10 text-accent-light border border-accent/20 flex items-center justify-center shrink-0"
      >
        <IconCode size={24} />
      </div>
      <div>
        <h3 class="text-lg font-bold text-text-primary mb-2">
          {$_("about_view.opensource_title")}
        </h3>
        <p class="text-text-muted leading-relaxed">
          {$_("about_view.opensource_desc")}
        </p>
      </div>
    </div>

    <!-- Card 2 -->
    <div
      class="p-6 bg-surface/4 backdrop-blur-2xl rounded-2xl border border-surface/8 shadow-xl flex gap-5 items-start transition-all hover:bg-surface/5"
    >
      <div
        class="w-12 h-12 rounded-xl bg-accent/10 text-accent-light border border-accent/20 flex items-center justify-center shrink-0"
      >
        <IconDatabase size={24} />
      </div>
      <div>
        <h3 class="text-lg font-bold text-text-primary mb-2">
          {$_("about_view.local_title")}
        </h3>
        <p class="text-text-muted leading-relaxed">
          {$_("about_view.local_desc")}
        </p>
      </div>
    </div>

    <!-- Card 3 -->
    <div
      class="p-6 bg-surface/4 backdrop-blur-2xl rounded-2xl border border-surface/8 shadow-xl flex gap-5 items-start transition-all hover:bg-surface/5"
    >
      <div
        class="w-12 h-12 rounded-xl bg-accent/10 text-accent-light border border-accent/20 flex items-center justify-center shrink-0"
      >
        <IconShieldCheck size={24} />
      </div>
      <div>
        <h3 class="text-lg font-bold text-text-primary mb-2">
          {$_("about_view.encryption_title")}
        </h3>
        <p class="text-text-muted leading-relaxed">
          {$_("about_view.encryption_desc")}
        </p>
      </div>
    </div>

    <!-- Resources -->
    <div
      class="p-6 bg-surface/4 backdrop-blur-2xl rounded-2xl border border-surface/8 shadow-xl"
    >
      <h3 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <IconBrandGithub size={22} class="text-accent" />
        {$_("about_view.links_title")}
      </h3>
      <div class="grid gap-2 sm:grid-cols-2">
        {#each links as link}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between px-4 py-3 rounded-xl bg-surface/5 border border-surface/8 text-sm text-text-secondary hover:bg-surface/10 hover:text-text-primary transition-all"
          >
            <span>{link.label}</span>
            <IconExternalLink size={16} class="text-text-muted shrink-0" />
          </a>
        {/each}
      </div>
      <div class="mt-4 flex items-center gap-2 text-sm text-text-muted">
        <IconLicense size={18} class="text-accent" />
        <span>
          {$_("about_view.license_label")}:
          <span class="font-mono text-text-secondary"
            >{$_("about_view.license_value")}</span
          >
        </span>
      </div>
    </div>
  </div>

  <li class="py-2 my-4 list-none">
    <p class="text-sm text-text-muted">
      {@html $_("about_view.update_info", {
        values: {
          link: `<a class="cursor-pointer font-bold hover:underline text-accent" href="https://github.com/aaronlomas/cript/releases/" target="_blank">Github Releases</a>`,
        },
      })}
    </p>
  </li>
</div>