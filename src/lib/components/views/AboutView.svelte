<script lang="ts">
  import { _ } from "svelte-i18n";
  import Logo from "$lib/components/ui/Logo.svelte";
  import {
    IconShieldCheck,
    IconEyeCheck,
    IconHomeLock,
  } from "@tabler/icons-svelte";
</script>

<div class="max-w-3xl mx-auto flex flex-col gap-y-4 h-full overflow-y-auto">
  <div class="flex items-center gap-x-4 p-2 rounded-2xl">
    <div
      class="inline-flex items-center w-20 h-20 bg-accent/10 text-accent rounded-full border border-accent/20 shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]"
    >
      <Logo size={40} class="text-accent ml-4" />
    </div>
    <div>
      <h1 class="text-3xl font-bold text-text-primary">
        {$_("about_view.title")}
      </h1>
      <p class="text-text-muted text-lg">
        {$_("about_view.subtitle")}
      </p>
    </div>
  </div>

  <div class="flex flex-col gap-y-4">
    <!-- Card 1 -->
    <div>
      <h3 class="text-lg font-bold text-text-primary">
        {$_("about_view.opensource_title")}
      </h3>
      <p class="text-text-muted leading-relaxed">
        {$_("about_view.opensource_desc")}
      </p>
    </div>

    <!-- Card 2 -->
    <div>
      <h3 class="text-lg font-bold text-text-primary">
        {$_("about_view.local_title")}
      </h3>
      <p class="text-text-muted leading-relaxed">
        {$_("about_view.local_desc")}
      </p>
    </div>

    <!-- Card 3 -->

    <div>
      <h3 class="text-lg font-bold text-text-primary">
        {$_("about_view.encryption_title")}
      </h3>
      <p class="text-text-muted leading-relaxed">
        {$_("about_view.encryption_desc")}
      </p>
    </div>
  </div>

  <li class="py-2 my-4 list-none">
    <p class="text-sm text-text-muted">
      {@html $_("about_view.update_info", {
        values: {
          link: `<a class="cursor-pointer font-bold hover:underline text-accent" href="https://criptportal.vercel.app/" target="_blank">Cript Portal</a>`,
        },
      })}
    </p>
  </li>
</div>
