<script lang="ts">
  /**
   * @component ChoiceCard
   * @description Compact selectable card used for mutually exclusive options.
   */
  import type { Snippet } from "svelte";

  interface Props {
    title: string;
    description: string;
    icon?: any;
    iconSnippet?: Snippet;
    active?: boolean;
    tone?: "accent" | "danger";
    onclick?: (event: MouseEvent) => void;
    class?: string;
  }

  let {
    title,
    description,
    icon: Icon,
    iconSnippet,
    active = false,
    tone = "accent",
    onclick,
    class: className = "",
  }: Props = $props();

  const activeStyles = {
    accent: "bg-accent/10 border-accent text-accent",
    danger: "bg-danger/10 border-danger text-danger",
  } as const;
</script>

<button
  type="button"
  aria-pressed={active}
  class="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center cursor-pointer {active
    ? activeStyles[tone]
    : 'bg-surface/5 border-surface/10 text-text-muted hover:bg-surface/10'} {className}"
  {onclick}
>
  {#if iconSnippet}
    {@render iconSnippet()}
  {:else if Icon}
    <Icon size={24} />
  {/if}

  <div class="flex flex-col">
    <span class="text-sm font-bold">{title}</span>
    <span class="text-xs opacity-70">{description}</span>
  </div>
</button>
