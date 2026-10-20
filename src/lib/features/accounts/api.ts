import { invoke } from "@tauri-apps/api/core";
import type { Account } from "$lib/features/accounts/types";

export async function addAccount(
  site: string,
  username: string,
  password: string,
  recoveryCode: string,
  notes: string,
): Promise<string> {
  return invoke<string>("add_account", {
    site,
    username,
    password,
    recoveryCode,
    notes,
  });
}

export async function readExternalFile(path: string): Promise<string> {
  return invoke<string>("read_external_file", { path });
}

export async function getAccounts(): Promise<Account[]> {
  try {
    return await invoke<Account[]>("get_accounts");
  } catch (err: any) {
    throw err;
  }
}

export async function deleteAccount(id: string): Promise<void> {
  return invoke("delete_account", { id });
}

export async function updateAccountGroup(
  id: string,
  groupName: string | null,
): Promise<void> {
  return invoke("update_account_group", { id, groupName });
}
