import { invoke } from "@tauri-apps/api/core";
import {
  addAccount,
  deleteAccount,
  getAccounts,
  readExternalFile,
  updateAccountGroup,
} from "$lib/features/accounts/api";
import {
  addPin,
  deletePin,
  getPins,
  updatePinGroup,
} from "$lib/features/pins/api";
export {
  addAccount,
  deleteAccount,
  getAccounts,
  readExternalFile,
  updateAccountGroup,
};
export { addPin, deletePin, getPins, updatePinGroup };

export async function isVaultInitialized(): Promise<boolean> {
  return invoke<boolean>("is_vault_initialized");
}

export interface CryptoParams {
  argon2_m_cost: number;
  argon2_t_cost: number;
  argon2_p_cost: number;
  nonce_len: number;
  tag_len: number;
}

export async function getCryptoParams(): Promise<CryptoParams> {
  return invoke<CryptoParams>("get_crypto_params");
}

export async function unlockVault(password: string): Promise<string> {
  try {
    const res = await invoke<string>("unlock_vault", { password });
    return res;
  } catch (err: any) {
    throw err;
  }
}

export async function lockVault(): Promise<void> {
  return invoke("lock_vault");
}

export async function generatePassword(
  length: number,
  useSymbols: boolean,
): Promise<string> {
  return invoke<string>("generate_password", { length, useSymbols });
}

// ─── Groups ───────────────────────────────────────────────────────────────────

export async function getGroups(): Promise<string[]> {
  const raw = await invoke<string | null>("get_preference", { key: "groups" });
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export async function saveGroups(groups: string[]): Promise<void> {
  return invoke("set_preference", {
    key: "groups",
    value: JSON.stringify(groups),
  });
}

export async function getGroupColors(): Promise<Record<string, string>> {
  const raw = await invoke<string | null>("get_preference", {
    key: "group_colors",
  });
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function saveGroupColors(
  colors: Record<string, string>,
): Promise<void> {
  return invoke("set_preference", {
    key: "group_colors",
    value: JSON.stringify(colors),
  });
}

export async function renameGroup(
  oldName: string,
  newName: string,
): Promise<void> {
  return invoke("rename_group", { oldName, newName });
}

export async function deleteGroup(name: string): Promise<void> {
  return invoke("delete_group", { name });
}

// ─── Documents ───────────────────────────────────────────────────────────────

export async function addDocument(
  title: string,
  description: string | null,
  content: string,
): Promise<string> {
  return invoke<string>("add_document", { title, description, content });
}

export async function getDocuments(): Promise<
  import("../stores/stores.svelte").Document[]
> {
  return invoke("get_documents");
}

export async function updateDocument(
  id: string,
  title: string,
  description: string | null,
  content: string,
): Promise<void> {
  return invoke("update_document", { id, title, description, content });
}

export async function deleteDocument(id: string): Promise<void> {
  return invoke("delete_document", { id });
}

export async function decryptDocumentContent(
  encryptedContent: string,
): Promise<string> {
  return invoke<string>("decrypt_document_content", { encryptedContent });
}

export async function decryptSecret(ciphertext: string): Promise<string> {
  try {
    const cleartext = await invoke<string>("decrypt_secret", { ciphertext });
    return cleartext;
  } catch (err: any) {
    throw err;
  }
}

export async function getOsUsername(): Promise<string> {
  return invoke<string>("get_os_username");
}
