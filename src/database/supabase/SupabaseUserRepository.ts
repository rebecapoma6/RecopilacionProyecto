import type { RegisterData } from "../../interfaces/Profile";
import type { SessionUser } from "../../interfaces/SessionUser";
import type { UpdateUserData, UserRepository } from "../repositories/UserRepository";
import { supabase } from "./Client";
import { SupabaseStorageRepository } from "./SupabaseStorageRepository";

export class SupabaseUserRepository implements UserRepository {
  storageRepository = new SupabaseStorageRepository();

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

        const { data: uploadData, error: uploadError } = await this.storageRepository.uploadFile('avatars', uploadedFilePath, data.avatar_file);

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

      return { data: { user, profile: profileData } };
    } catch (error) {
      console.error('Error en SupabaseUserRepository.createUser:', error);
      return { error };
    }
  }

  async fetchAdminUsersList(): Promise<{ data?: any[] | null; error?: any; }> {
    const { data, error } = await supabase.rpc('get_admin_users_list');

    if (error) {
      console.error('Error obteniendo la lista de usuarios:', error);
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

  async updateUserRole(userId: string, newRole: string): Promise<{ error?: any; }> {
    try {
      const { error } = await supabase.from('user_roles').update({ role: newRole }).eq('id', userId);
      return { error };
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      return { error };
    }
  }

  async updateUser(updates: UpdateUserData): Promise<{ data?: SessionUser; error?: any }> {
    try {
      const { data: currentUserData, error: currentUserError } = await supabase.auth.getUser();
      const currentUser = currentUserData.user;

      if (currentUserError || !currentUser) {
        return { error: currentUserError || { message: 'No hay usuario autenticado' } };
      }

      const { data: currentProfile, error: profileFetchError } = await supabase
        .from('Profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileFetchError) {
        return { error: profileFetchError };
      }

      const payload: { email?: string; password?: string; data?: { username?: string } } = {};

      if (updates.email) payload.email = updates.email;
      if (updates.password) payload.password = updates.password;
      if (updates.username) payload.data = { username: updates.username };

      let updatedUser = currentUser;

      if (Object.keys(payload).length > 0) {
        const { data: authUpdateData, error: authError } = await supabase.auth.updateUser(payload);
        if (authError) return { error: authError };
        updatedUser = authUpdateData.user ?? currentUser;
      }

      let publicAvatarUrl = currentProfile?.avatar_url ?? null;
      let uploadedFilePath: string | null = null;

      if (updates.avatar_file) {
        const fileExt = updates.avatar_file.name.split('.').pop();
        uploadedFilePath = `${currentUser.id}-${crypto.randomUUID()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await this.storageRepository.uploadFile('avatars', uploadedFilePath, updates.avatar_file);
        if (uploadError) return { error: uploadError };
        publicAvatarUrl = uploadData?.publicUrl ?? null;
      } else if (updates.avatar_url !== undefined) {
        publicAvatarUrl = updates.avatar_url;
      }

      const profileUpdates: { username?: string; avatar_url?: string | null } = {};
      if (updates.username) profileUpdates.username = updates.username;
      if (updates.avatar_file || updates.avatar_url !== undefined) profileUpdates.avatar_url = publicAvatarUrl;

      let updatedProfile = currentProfile;

      if (Object.keys(profileUpdates).length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('Profiles')
          .update(profileUpdates)
          .eq('id', currentUser.id)
          .select()
          .single();

        if (profileError) {
          if (uploadedFilePath) {
            await this.storageRepository.removeImage('avatars', uploadedFilePath);
          }
          return { error: profileError };
        }

        updatedProfile = profileData;

        const oldFileName = currentProfile?.avatar_url?.split('/').pop();
        if (uploadedFilePath && oldFileName && oldFileName !== uploadedFilePath) {
          await this.storageRepository.removeImage('avatars', oldFileName);
        }
      }

      return { data: { user: updatedUser, profile: updatedProfile } };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { error };
    }
  }

  async deleteUser(userId: string): Promise<{ error?: any; }> {
    try {
      const { data: files } = await supabase.storage.from('avatars').list(userId);

      if (files && files.length > 0) {
        const filesToRemove = files.map((file) => `${userId}/${file.name}`);
        await supabase.storage.from('avatars').remove(filesToRemove);
      }

      await supabase.from('Profiles').update({ avatar_url: null }).eq('id', userId);

      const { error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId,
      });

      if (error) {
        console.error('Error de Supabase al borrar usuario:', error.message);
      }

      return { error };
    } catch (error) {
      console.error('Error inesperado en deleteUser:', error);
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

    const { data: profileData, error: profileError } = await supabase
      .from('Profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      return { error: profileError };
    }

    return {
      data: {
        user: authData.user,
        profile: profileData,
      },
    };
  }

  async logout(): Promise<{ error?: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { data: user, error };
  }
}
