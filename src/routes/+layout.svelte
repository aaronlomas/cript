<script lang="ts">
  import "../layout.css";
  import { onMount } from "svelte";
  import { themeStore } from "$lib/stores/theme.svelte";
  import { performanceStore } from "$lib/stores/performance.svelte";
  import { initI18n } from "$lib/i18n";
  import { isLoading, waitLocale } from "svelte-i18n";
  import TitleBar from "$lib/components/ui/TitleBar.svelte";
  import Toast from "$lib/components/modals/notifications/Toast.svelte";
  import ModalHost from "$lib/components/modals/ModalHost.svelte";
  import Cli from "$lib/components/features/cli/log/Log.svelte";
  import { startPersistentLogListener } from "$lib/utils/logEvents";
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { modal } from "$lib/stores/modal.svelte";

  let { children } = $props();
  let initialized = $state(false);
  const appWindow = getCurrentWindow();

  onMount(async () => {
    // Start i18n init as early as possible
    await initI18n();
    // Wait for the locale to be loaded
    await waitLocale();
    // Initialize theme
    await themeStore.init();
    // Load performance preferences
    performanceStore.init();
    // Start always-on log listener (captures unlock/import errors on login screen)
    await startPersistentLogListener();

    initialized = true;
  });
</script>

{#if initialized && !$isLoading}
  <!-- Resize handles — hidden when a modal is open so they don't intercept mouse events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed top-0 left-0 w-full h-1 cursor-n-resize"
    class:pointer-events-none={modal.current !== null}
    onmousedown={() => appWindow.startResizeDragging("North")}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed bottom-0 left-0 w-full h-1 cursor-s-resize"
    class:pointer-events-none={modal.current !== null}
    onmousedown={() => appWindow.startResizeDragging("South")}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed top-0 left-0 w-1 h-full cursor-w-resize"
    class:pointer-events-none={modal.current !== null}
    onmousedown={() => appWindow.startResizeDragging("West")}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed top-0 right-0 w-1 h-full cursor-e-resize"
    class:pointer-events-none={modal.current !== null}
    onmousedown={() => appWindow.startResizeDragging("East")}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed top-0 left-0 w-2 h-2 cursor-nw-resize"
    class:pointer-events-none={modal.current !== null}
    onmousedown={() => appWindow.startResizeDragging("NorthWest")}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed top-0 right-0 w-2 h-2 cursor-ne-resize"
    class:pointer-events-none={modal.current !== null}
    onmousedown={() => appWindow.startResizeDragging("NorthEast")}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed bottom-0 left-0 w-2 h-2 cursor-sw-resize"
    class:pointer-events-none={modal.current !== null}
    onmousedown={() => appWindow.startResizeDragging("SouthWest")}
  ></div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed bottom-0 right-0 w-2 h-2 cursor-se-resize"
    class:pointer-events-none={modal.current !== null}
    onmousedown={() => appWindow.startResizeDragging("SouthEast")}
  ></div>

  <div class="flex flex-col h-screen overflow-hidden" class:pointer-events-none={modal.current !== null}>
    <TitleBar />
    <div class="flex-1 overflow-hidden">
      {@render children?.()}
    </div>
    <Cli />
  </div>
  <Toast />
  <ModalHost />
{/if}

