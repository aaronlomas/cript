import { invoke } from "@tauri-apps/api/core";
import type { Pin } from "$lib/features/pins/types";

export async function addPin(
  name: string,
  pin: string,
  notes: string,
): Promise<string> {
  return invoke<string>("add_pin", { name, pin, notes });
}

export async function getPins(): Promise<Pin[]> {
  return invoke<Pin[]>("get_pins");
}

export async function deletePin(id: string): Promise<void> {
  return invoke("delete_pin", { id });
}

export async function updatePinGroup(
  id: string,
  groupName: string | null,
): Promise<void> {
  return invoke("update_pin_group", { id, groupName });
}
