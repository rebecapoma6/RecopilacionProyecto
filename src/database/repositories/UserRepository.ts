import type { RegisterData } from "../../interfaces/Profile";
import type { SessionUser } from "../../interfaces/SessionUser";

export interface UserRepository {
// -----------------------------
  // CREATE
  // -----------------------------
  createUser(data: RegisterData): Promise<{ data?: SessionUser; error?: any }>;

  // -----------------------------
  // READ
  // -----------------------------
  fetchRole(userId: string): Promise<{ data?: string | null, error?: any }>;
  fetchAdminUsersList(): Promise<{ data?: any[] | null, error?: any }>;
  getCurrentUser(): Promise<{ data?: any; error?: any }>;

  // -----------------------------
  // UPDATE
  // -----------------------------
  updateUser(updates: { username?: string; email?: string; password?: string; }): Promise<{ data?: any; error?: any }>;
  updateUserRole(userId: string, newRole: string): Promise<{ error?: any }>;

  // -----------------------------
  // DELETE
  // -----------------------------
  deleteUser(userId: string): Promise<{ error?: any }>;

  // -----------------------------
  // AUTH
  // -----------------------------
  login(email: string, password: string): Promise<{ data?: SessionUser; error?: any }>;
  logout(): Promise<{ error?: any }>;
}