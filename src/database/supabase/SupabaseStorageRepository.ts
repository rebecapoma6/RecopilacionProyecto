import type { StorageRepository } from "../repositories/StorageRepository";
import { supabase } from "./Client";



export class SupabaseStorageRepository implements StorageRepository {
  async getPublicUrl(bucketName: string, filePath: string): Promise<{ data: { publicUrl: string; }; }> {
    const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
        return { data: { publicUrl: data.publicUrl } };
  }
  
  async uploadFile(bucketName: string, filePath: string, file: File) {
    // 1. Subir el archivo al bucket
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) return { error: uploadError };

    // 2. Obtener la URL pública tras la subida exitosa
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return { data: { publicUrl: data.publicUrl }, error: null };
  }

  async removeImage(bucketName: string, filePath: string) {
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
    return { error };
  }
}

