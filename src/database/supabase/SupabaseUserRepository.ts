import type { RegisterData } from "../../interfaces/Profile";
import type { SessionUser } from "../../interfaces/SessionUser";
import type { UserRepository } from "../repositories/UserRepository";
import { supabase } from "./Client";

export class SupabaseUserRepository implements UserRepository {

  async fetchRole(userId: string): Promise<{ data?: string | null; error?: any; }> {
    const { data: dataRole, error: fetchRoleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', userId) //
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

      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) return { error: authError };
      if (!authData.user) return { error: { message: 'No se pudo crear el usuario en Auth' } };

      const user = authData.user;

     
      const { data: profileData, error: profileError } = await supabase
        .from('Profiles') 
        .insert({
          id: user.id, 
          username: data.username,
          // avatar_url: data.avatar_url ?? null,
          // role: data.role ?? 'user',
        })
        .select()
        .single();

      
      if (profileError) {
        
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

  //ANGEL

    async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { data: user, error };
  }

  async updateUser(updates: {
    username?: string;
    email?: string;
    password?: string;
  }) {
    const payload: any = {};

    if (updates.email) payload.email = updates.email;
    if (updates.password) payload.password = updates.password;
    if (updates.username) payload.data = { username: updates.username };

    const { data, error } = await supabase.auth.updateUser(payload);
    return { data, error };
  }
}