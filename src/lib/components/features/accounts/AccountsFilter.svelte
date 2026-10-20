<script lang="ts">
  /**
   * @component AccountsFilter
   * @description Search input to filter credentials.
   */
  import { _ } from "svelte-i18n";
  import SearchInput from "../../core/primitives/SearchInput.svelte";

  let { search = $bindable() }: { search: string } = $props();
</script>

<SearchInput
  bind:value={search}
  placeholder={$_("accounts.search_placeholder")}
  class="mb-4"
/>
