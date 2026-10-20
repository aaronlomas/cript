export interface Account {
  id: string;
  site: string;
  username: string;
  password_cipher: string;
  recovery_code_cipher: string | null;
  notes_cipher: string | null;
  favicon_url: string | null;
  group_name: string | null;
  created_at: string;
  updated_at: string;
}
