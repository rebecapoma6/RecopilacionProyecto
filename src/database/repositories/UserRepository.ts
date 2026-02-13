import type { RegisterData } from "../../interfaces/Profile";
import type { SessionUser } from "../../interfaces/SessionUser";

export interface UserRepository {
  
  logout(): Promise<{ error?: any }>;


   
  createUser(data: RegisterData): Promise<{ data?: SessionUser; error?: any }>;

 
  login(email: string, password: string): Promise<{ data?: SessionUser; error?: any }>;
}