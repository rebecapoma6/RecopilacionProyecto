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
  // Mantenemos esta por si acaso (opcional)
  avatar_url?: string; 
  role?: string;
  // ¡Agregamos esta línea clave para recibir el archivo físico!
  avatar_file?: File;
}