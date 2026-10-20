import type { Account } from "$lib/features/accounts/types";
import type { Pin } from "$lib/features/pins/types";

export type { Account } from "$lib/features/accounts/types";
export type { Pin } from "$lib/features/pins/types";

export interface Document {
  id: string;
  title: string;
  encrypted_description: string | null;
  encrypted_content: string;
  created_at: string;
  updated_at: string;
}

export class DataState {
  accounts = $state<Account[]>([]);
  pins = $state<Pin[]>([]);
  documents = $state<Document[]>([]);
  /** Persisted list of group names. */
  groups = $state<string[]>([]);
  /** Persisted group colors. */
  groupColors = $state<Record<string, string>>({});
}

export const dataState = new DataState();
