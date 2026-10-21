<script lang="ts">
  import { tick, onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { getOsUsername } from "$lib/utils/tauri";
  import { _ } from "svelte-i18n";

  type TerminalLineKind = "command" | "output" | "hint" | "separator";

  interface TerminalLine {
    id: string;
    text: string;
    kind: TerminalLineKind;
  }

  /** Marker the engine appends to close the output block of a command. */
  const OUTPUT_END_MARKER = "#";

  let history = $state<TerminalLine[]>([
    { id: crypto.randomUUID(), text: $_("terminal.hint"), kind: "hint" },
  ]);
  let inputValue = $state("");
  let terminalContainer: HTMLDivElement | undefined = $state();
  let inputElement: HTMLInputElement | undefined = $state();
  let username = $state("");
  let prompt = $derived(username ? `${username}@criptor:~$` : "criptor:~$");

  onMount(async () => {
    try {
      username = await getOsUsername();
    } catch {
      // username stays empty, prompt falls back gracefully
    }
  });

  export function clear() {
    history = [];
  }

  $effect(() => {
    if (history.length && terminalContainer) {
      tick().then(() => {
        if (terminalContainer) terminalContainer.scrollTop = terminalContainer.scrollHeight;
      });
    }
  });

  /**
   * Appends the engine response to the history.
   *
   * The engine closes every output block with a '#' line. That marker is a
   * protocol detail, so it is consumed here and replaced by a visual
   * separator that delimits the block for the user.
   */
  function appendOutput(lines: string[]) {
    const closed = lines.at(-1) === OUTPUT_END_MARKER;
    const body = closed ? lines.slice(0, -1) : lines;

    for (const line of body) {
      history.push({ id: crypto.randomUUID(), text: line, kind: "output" });
    }

    if (closed) {
      history.push({ id: crypto.randomUUID(), text: "", kind: "separator" });
    }
  }

  async function executeCommand(cmd: string) {
    const trimmed = cmd.trim();

    // Echo the command line
    history.push({ id: crypto.randomUUID(), text: `${prompt} ${trimmed}`, kind: "command" });

    if (!trimmed) return;

    const command = trimmed.split(" ")[0].toLowerCase();

    // Handle client-side only commands
    if (command === "clear") {
      clear();
      return;
    }

    // All other commands are dispatched to the criptor engine via Tauri
    try {
      const lines = await invoke<string[]>("shell_query", { input: trimmed });
      appendOutput(lines);
    } catch (err) {
      history.push({
        id: crypto.randomUUID(),
        text: $_("terminal.error", { values: { message: String(err) } }),
        kind: "output",
      });
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputValue);
      inputValue = "";
    }
  }

  $effect(() => {
    if (inputElement) inputElement.focus();
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={terminalContainer}
  class="flex flex-col flex-1 w-full px-4 overflow-y-auto font-mono text-sm leading-relaxed custom-scrollbar"
  onclick={() => inputElement?.focus()}
>
  {#each history as line (line.id)}
    {#if line.kind === "separator"}
      <div class="log-line my-1 border-t border-surface/10" data-testid="terminal-separator"></div>
    {:else}
      <div
        class="log-line rounded-sm whitespace-pre-wrap wrap-break-word {line.kind === "command"
          ? 'text-accent/90 font-medium'
          : line.kind === "hint"
            ? 'text-text-muted italic'
            : 'text-text-primary/70'}"
      >
        {line.text}
      </div>
    {/if}
  {/each}

  <div class="flex items-center mt-1">
    <span class="text-accent/90 font-medium mr-2 whitespace-pre">{prompt} </span>
    <input
      bind:this={inputElement}
      bind:value={inputValue}
      onkeydown={handleKeydown}
      type="text"
      class="flex-1 bg-transparent outline-none text-text-primary/90 font-mono caret-accent"
      autocomplete="off"
      spellcheck="false"
    />
  </div>
</div>
