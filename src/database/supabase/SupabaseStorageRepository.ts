import { supabase } from "./Client";

export interface StorageRepository {
  uploadFile(bucketName: string, filePath: string, file: File): Promise<{ data?: { publicUrl: string }; error?: any }>;
  removeImage(bucketName: string, filePath: string): Promise<{ error?: any }>;
}

export class SupabaseStorageRepository implements StorageRepository {
  
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

export const createStorageRepository = () => new SupabaseStorageRepository();