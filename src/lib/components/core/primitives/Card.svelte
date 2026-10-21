<script lang="ts">
  import type { Snippet } from "svelte";
  import { IconCheck } from "@tabler/icons-svelte";

  interface Props {
    title: string;
    description?: string;
    icon?: any;
    iconSnippet?: Snippet;
    onclick?: (e: MouseEvent) => void;
    disabled?: boolean;
    class?: string;
    active?: boolean;
  }

  let {
    title,
    description,
    icon: Icon,
    iconSnippet,
    onclick,
    disabled = false,
    class: className = "",
    active = false,
  }: Props = $props();
</script>

<button
  class="flex flex-col items-start text-left p-6 gap-4 bg-surface/8 rounded-2xl border shadow-xl hover:border-accent/30 hover:bg-surface/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer {active
    ? 'border-accent bg-accent/10 ring-2 ring-accent/30 shadow-accent/5'
    : 'border-surface/8'} {className}"
  {onclick}
  {disabled}
>
  {#if Icon || iconSnippet}
    <div class="flex items-center justify-between w-full">
      <div
        class="w-12 h-12 rounded-xl bg-accent/10 text-accent-light border border-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0"
      >
        {#if iconSnippet}
          {@render iconSnippet()}
        {:else}
          <Icon size={24} />
        {/if}
      </div>

      {#if active}
        <span
          class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-light shadow-sm"
        >
          <IconCheck size={14} />
        </span>
      {/if}
    </div>
  {/if}
  <div>
    <h3 class="text-lg font-semibold text-text-primary {description ? 'mb-1' : ''}">
      {title}
    </h3>
    {#if description}
      <p class="text-sm text-text-muted">
        {description}
      </p>
    {/if}
  </div>
</button>
