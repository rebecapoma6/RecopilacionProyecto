import type { RegisterData } from "../../interfaces/Profile";
import type { SessionUser } from "../../interfaces/SessionUser";
import type { UserRepository } from "../repositories/UserRepository";
import { supabase } from "./Client";
import { SupabaseStorageRepository } from "./SupabaseStorageRepository";

export class SupabaseUserRepository implements UserRepository {

  storageRepository = new SupabaseStorageRepository();

 async fetchAdminUsersList(): Promise<{ data?: any[] | null; error?: any; }> {
    const { data, error } = await supabase.rpc('get_admin_users_list');

    if (error) {
      console.error("Error obteniendo la lista de usuarios:", error);
      return { data: null, error };
    }

    return { data, error: null };
  }

  async fetchRole(userId: string): Promise<{ data?: string | null; error?: any; }> {
    const { data: dataRole, error: fetchRoleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', userId) 
      .single();

    if (fetchRoleError) {
      return { data: null, error: fetchRoleError };
    }

    return { data: dataRole?.role || null, error: null };
  }

  async createUser(data: RegisterData): Promise<{ data?: SessionUser; error?: any }> {
    try {
      if (!data.email || !data.password || !data.username) {
        return { error: { message: 'Email, usuario y contraseña son obligatorios' } };
      }
      
      // A. Crear el usuario en la autenticación de Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) return { error: authError };
      if (!authData.user) return { error: { message: 'No se pudo crear el usuario en Auth' } };

      const user = authData.user;

      // B. Lógica para subir el Avatar al Storage
      let publicAvatarUrl: string | null = null;
      let uploadedFilePath: string | null = null;

      // Si en el formulario adjuntaron una imagen (data.avatar_file)
      if (data.avatar_file) {
        const fileExt = data.avatar_file.name.split('.').pop();
        // Usamos el ID del usuario para que el nombre de la foto sea único
        uploadedFilePath = `${user.id}-${crypto.randomUUID()}.${fileExt}`;

        // Subimos al bucket 'avatars' (Asegúrate de tener este bucket creado en Supabase)
        const { data: uploadData, error: uploadError } = await this.storageRepository.uploadFile(
          'avatars', 
          uploadedFilePath,
          data.avatar_file
        );

        if (!uploadError && uploadData) {
          publicAvatarUrl = uploadData.publicUrl;
        } else {
          console.error("Error subiendo el avatar:", uploadError);
          // Decidimos continuar el registro aunque la foto falle
        }
      }

      // C. Insertar los datos en tu tabla Profiles (¡ahora con la foto!)
      const { data: profileData, error: profileError } = await supabase
        .from('Profiles') 
        .insert({
          id: user.id, 
          username: data.username,
          avatar_url: publicAvatarUrl, // ¡Descomentado y usando nuestra nueva variable!
        })
        .select()
        .single();
      
      // D. Rollback: Si por alguna razón falla guardar el perfil, borramos la foto para no ocupar espacio basura
      if (profileError) {
        if (uploadedFilePath) {
          await this.storageRepository.removeImage('avatars', uploadedFilePath);
        }
        return { error: profileError };
      }
      
      const sessionUser: SessionUser = {
        user,
        profile: profileData,
      };

      return { data: sessionUser };

    } catch (error) {
      console.error('Error en SupabaseUserRepository.createUser:', error);
      return { error };
    }
  }

  async login(email: string, password: string): Promise<{ data?: SessionUser; error?: any }> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) return { error: authError };
    if (!authData.user) return { error: { message: 'No se recibió usuario tras login' } };
    
    const { data: profile, error: profileError } = await supabase
      .from('Profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      return { error: profileError };
    }

    const sessionUser: SessionUser = {
      user: authData.user,
      profile: profile,
    };

    return { data: sessionUser };
  }

  async logout(): Promise<{ error?: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  // Métodos de ANGEL
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { data: user, error };
  }

  async updateUser(updates: { username?: string; email?: string; password?: string; }) {
    const payload: any = {};

    if (updates.email) payload.email = updates.email;
    if (updates.password) payload.password = updates.password;
    if (updates.username) payload.data = { username: updates.username };

    const { data, error } = await supabase.auth.updateUser(payload);
    return { data, error };
  }
}