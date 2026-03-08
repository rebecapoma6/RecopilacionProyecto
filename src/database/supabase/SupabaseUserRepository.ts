import type { RegisterData } from "../../interfaces/Profile";
import type { SessionUser } from "../../interfaces/SessionUser";
import type { UserRepository } from "../repositories/UserRepository";
import { supabase } from "./Client";
import { SupabaseStorageRepository } from "./SupabaseStorageRepository";

export class SupabaseUserRepository implements UserRepository {

  // -----------------------------
  // CREAR UN USUARIO
  // -----------------------------
  async createUser(data: RegisterData): Promise<{ data?: SessionUser; error?: any }> {
    try {
      if (!data.email || !data.password || !data.username) {
        return { error: { message: 'Email, usuario y contraseña son obligatorios' } };
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) return { error: authError };
      if (!authData.user) return { error: { message: 'No se pudo crear el usuario en Auth' } };

      const user = authData.user;

      let publicAvatarUrl: string | null = null;
      let uploadedFilePath: string | null = null;

      if (data.avatar_file) {
        const fileExt = data.avatar_file.name.split('.').pop();
        uploadedFilePath = `${user.id}-${crypto.randomUUID()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await this.storageRepository.uploadFile(
          'avatars',
          uploadedFilePath,
          data.avatar_file
        );

        if (!uploadError && uploadData) {
          publicAvatarUrl = uploadData.publicUrl;
        }
      }

      const { data: profileData, error: profileError } = await supabase
        .from('Profiles')
        .insert({
          id: user.id,
          username: data.username,
          avatar_url: publicAvatarUrl,
        })
        .select()
        .single();

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


  // -----------------------------
  // Obtener Lista de usuarios Administradores
  // -----------------------------
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


  // -----------------------------
  // ACTUALIZAR ROL DE UN USUARIO
  // -----------------------------
  async updateUserRole(userId: string, newRole: string): Promise<{ error?: any; }> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', userId);

      return { error };
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      return { error };
    }
  }


  // -----------------------------
  // ACTUALIZAR UN USUARIO
  // -----------------------------
  async updateUser(updates: { username?: string; email?: string; password?: string; }) {
    const payload: any = {};

    if (updates.email) payload.email = updates.email;
    if (updates.password) payload.password = updates.password;
    if (updates.username) payload.data = { username: updates.username };

    const { data, error } = await supabase.auth.updateUser(payload);
    return { data, error };
  }


  // -----------------------------
  // ELIMINAR UN USUARIO
  // -----------------------------
  async deleteUser(userId: string): Promise<{ error?: any; }> {
    try {
      const { data: files } = await supabase.storage.from('avatars').list(userId);

      if (files && files.length > 0) {
        const filesToRemove = files.map(file => `${userId}/${file.name}`);
        await supabase.storage.from('avatars').remove(filesToRemove);
      }

      await supabase.from('Profiles').update({ avatar_url: null }).eq('id', userId);

      const { error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId
      });

      if (error) {
        console.error("Error de Supabase al borrar usuario:", error.message);
      }

      return { error };
    } catch (error) {
      console.error("Error inesperado en deleteUser:", error);
      return { error };
    }
  }


  // -----------------------------
  // AUTHENTICATION
  // -----------------------------
  async login(email: string, password: string): Promise<{ data?: SessionUser; error?: any }> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) return { error: authError };
    if (!authData.user) return { error: { message: 'No se recibió usuario tras login' } };

    const { data: profileData, error: profileError } = await supabase
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
      profile: profileData,
    };

    return { data: sessionUser };
  }

  async logout(): Promise<{ error?: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }


  // -----------------------------
  // UTILIDADES
  // -----------------------------
  storageRepository = new SupabaseStorageRepository();

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { data: user, error };
  }
}