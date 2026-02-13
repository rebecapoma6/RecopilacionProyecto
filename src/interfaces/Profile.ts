export interface Profile {
  id: string;
  username: string;
  avatar_url?: string | null;
  role?: string;
  created_at?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  avatar_url?: string;
  role?: string;
}