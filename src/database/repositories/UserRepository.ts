import type { RegisterData } from "../../interfaces/Profile";
import type { SessionUser } from "../../interfaces/SessionUser";

export interface UserRepository {

  logout(): Promise<{ error?: any }>;

  fetchRole(userId: string): Promise<{ data?: string | null, error?: any }>

  createUser(data: RegisterData): Promise<{ data?: SessionUser; error?: any }>;

  login(email: string, password: string): Promise<{ data?: SessionUser; error?: any }>;

  getCurrentUser(): Promise<{ data?: any; error?: any }>;

  updateUser(updates: { username?: string; email?: string; password?: string; }): Promise<{ data?: any; error?: any }>;
  
  fetchAdminUsersList(): Promise<{ data?: any[] | null, error?: any }>;
}