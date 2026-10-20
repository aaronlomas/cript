<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    IconBold,
    IconItalic,
    IconAlignLeft,
    IconAlignCenter,
    IconAlignRight,
    IconUnderline,
    IconStrikethrough,
    IconList,
    IconListNumbers,
    IconChevronDown,
    IconEraser,
    IconPaperclip,
  } from "@tabler/icons-svelte";
  import type { BoardStore } from "../store.svelte";
  import IconButton from "$lib/components/core/primitives/IconButton.svelte";
  import Button from "$lib/components/core/primitives/Button.svelte";
  import Menu from "$lib/components/core/primitives/Menu.svelte";
  import MenuItem from "$lib/components/core/primitives/MenuItem.svelte";

  let { store }: { store: BoardStore } = $props();
  let showSizeDropdown = $state(false);
  let fileInput: HTMLInputElement | undefined = $state();

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  async function handleFileSelected(e: Event) {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    const file = target.files[0];
    try {
      const text = await file.text();
      if (store.editorRef) {
        store.editorRef.focus();
        document.execCommand("insertText", false, text);
        store.syncContent();
      }
    } catch (err) {
      console.error(err);
    }
    target.value = "";
  }
</script>

<div class="h-12 flex items-center gap-2 p-3 border-b border-surface/8 bg-surface/2">
  <div class="flex items-center gap-1 rounded-lg p-1">
    <!-- Custom Font Size Dropdown -->
    <div class="relative">
      <Button
        variant="secondary"
        size="sm"
        onclick={() => (showSizeDropdown = !showSizeDropdown)}
        class="h-8 min-w-18 justify-between gap-2"
      >
        <span class="font-medium">{store.currentSize}</span>
        <IconChevronDown
          size={12}
          class="text-text-muted transition-colors {showSizeDropdown
            ? 'rotate-180'
            : ''}"
        />
      </Button>

      {#if showSizeDropdown}
        <Menu
          open={showSizeDropdown}
          align="left"
          class="min-w-16 max-h-64 overflow-y-auto py-2 custom-scrollbar"
        >
          {#each fontSizes as size (size)}
            <MenuItem
              active={store.currentSize === size}
              onclick={() => {
                store.handleFontSize(size);
                showSizeDropdown = false;
              }}
              class="px-4 py-2 text-xs"
            >
              {size}
            </MenuItem>
          {/each}
        </Menu>

        <div
          role="presentation"
          class="fixed inset-0 z-10"
          onclick={() => (showSizeDropdown = false)}
          onkeydown={(e) => {
            if (e.key === "Escape") showSizeDropdown = false;
          }}
        ></div>
      {/if}
    </div>

    <IconButton
      variant="ghost"
      active={store.isBold}
      onclick={() => store.handleCommand("bold")}
      label={$_("board.bold")}
      title={$_("board.bold")}
    >
      <IconBold size={18} stroke={2.5} />
    </IconButton>

    <IconButton
      variant="ghost"
      active={store.isItalic}
      onclick={() => store.handleCommand("italic")}
      label={$_("board.italic")}
      title={$_("board.italic")}
    >
      <IconItalic size={18} stroke={2.5} />
    </IconButton>

    <IconButton
      variant="ghost"
      active={store.isUnderline}
      onclick={() => store.handleCommand("underline")}
      label={$_("board.underline")}
      title={$_("board.underline")}
    >
      <IconUnderline size={18} stroke={2.5} />
    </IconButton>

    <IconButton
      variant="ghost"
      active={store.isStrikethrough}
      onclick={() => store.handleCommand("strikeThrough")}
      label={$_("board.strikethrough")}
      title={$_("board.strikethrough")}
    >
      <IconStrikethrough size={18} stroke={2.5} />
    </IconButton>
  </div>

  <div class="w-px h-6 bg-surface/20 mx-1"></div>

  <div class="flex items-center gap-1 rounded-lg p-1">
    <IconButton
      variant="ghost"
      active={store.isListUl}
      onclick={() => store.handleCommand("insertUnorderedList")}
      label={$_("board.list_ul")}
      title={$_("board.list_ul")}
    >
      <IconList size={18} stroke={2.5} />
    </IconButton>

    <IconButton
      variant="ghost"
      active={store.isListOl}
      onclick={() => store.handleCommand("insertOrderedList")}
      label={$_("board.list_ol")}
      title={$_("board.list_ol")}
    >
      <IconListNumbers size={18} stroke={2.5} />
    </IconButton>
  </div>

  <div class="w-px h-6 bg-surface/20 mx-1"></div>

  <div class="flex items-center gap-1 rounded-lg p-1">
    <IconButton
      variant="ghost"
      active={store.textAlign === "left"}
      onclick={() => store.handleCommand("justifyLeft")}
      label={$_("board.align_left")}
      title={$_("board.align_left")}
    >
      <IconAlignLeft size={18} stroke={2.5} />
    </IconButton>

    <IconButton
      variant="ghost"
      active={store.textAlign === "center"}
      onclick={() => store.handleCommand("justifyCenter")}
      label={$_("board.align_center")}
      title={$_("board.align_center")}
    >
      <IconAlignCenter size={18} stroke={2.5} />
    </IconButton>

    <IconButton
      variant="ghost"
      active={store.textAlign === "right"}
      onclick={() => store.handleCommand("justifyRight")}
      label={$_("board.align_right")}
      title={$_("board.align_right")}
    >
      <IconAlignRight size={18} stroke={2.5} />
    </IconButton>
  </div>

  <div class="w-px h-6 bg-surface/20 mx-1"></div>

  <IconButton
    variant="danger"
    onclick={() => store.handleCommand("removeFormat")}
    label={$_("board.clear_format")}
    title={$_("board.clear_format")}
  >
    <IconEraser size={18} stroke={2.5} />
  </IconButton>

  <div class="w-px h-6 bg-surface/20 mx-1"></div>

  <IconButton
    variant="accent"
    onclick={() => fileInput?.click()}
    label={$_("board.attach_file")}
    title={$_("board.attach_file")}
  >
    <IconPaperclip size={18} stroke={2.5} />
  </IconButton>
  <input
    type="file"
    bind:this={fileInput}
    onchange={handleFileSelected}
    class="hidden"
    accept=".txt,.md,.json,.csv,.log,.html,.xml,.yml,.yaml,.toml"
  />
</div>
