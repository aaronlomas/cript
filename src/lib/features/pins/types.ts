export interface Pin {
  id: string;
  name: string;
  encrypted_pin: string;
  encrypted_notes: string | null;
  group_name: string | null;
  created_at: string;
  updated_at: string;
}
