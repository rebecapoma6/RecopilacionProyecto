import type { User } from "@supabase/supabase-js"


export interface SessionUser{
    user: User
    // profile: Profile | null
}