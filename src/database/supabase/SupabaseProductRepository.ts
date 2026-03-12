import type { Product } from "../../interfaces/Products";
import type { ProductRepository } from "../repositories/ProductRepository";
import { supabase } from "./Client";
import { SupabaseStorageRepository } from "./SupabaseStorageRepository";



export class SupabaseProductRepository implements ProductRepository {
  
  // Repositorio de Storage
  // Instanciamos el repositorio de storage para reutilizar la lógica de subida
  storageRepository = new SupabaseStorageRepository();


  // ========================== CREATE ===========================
  // Crear un nuevo producto (con subida opcional de imagen)
  async createProduct(data: Partial<Product> & { imagen_file?: File }) {
    console.log("Datos recibidos en repo:", data);
    try {

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { error: new Error("No hay un usuario autenticado") };
      }

      let publicImageUrl = data.imagen_url || null;
      let uploadedFilePath: string | null = null;

      // 1. Si viene un archivo físico, lo subimos primero al Storage
      if (data.imagen_file) {
        const fileExt = data.imagen_file.name.split('.').pop();
        uploadedFilePath = `${crypto.randomUUID()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await this.storageRepository.uploadFile(
          'ImagenProductos',
          uploadedFilePath,
          data.imagen_file
        );

        if (uploadError) {
          return { error: uploadError };
        }

        publicImageUrl = uploadData?.publicUrl ?? null;
      }

      // 2. Insertamos el registro en la tabla "Registros"
      const { data: productData, error: insertError } = await supabase
        .from("Registros")
        .insert({
          id: user.id,
          titulo: data.titulo,
          resena: data.resena,
          imagen_url: publicImageUrl,
          tipo: data.tipo,
          genero: data.genero,
          autor: data.autor,
          fecha_fin: data.fecha_fin,
          puntuacion: data.puntuacion
        })
        .select()
        .single();

      // 3. Rollback si falla la inserción
      if (insertError) {
        if (uploadedFilePath) {
          await this.storageRepository.removeImage('ImagenProductos', uploadedFilePath);
        }
        return { error: insertError };
      }

      return { data: productData as Product };

    } catch (error) {
      console.error("Error en createProduct:", error);
      return { error };
    }
  }


  // ============================ READ ===========================
  // Leer productos del usuario autenticado
  async readProduct() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { data: [], error: new Error("No autenticado") };

    const { data, error } = await supabase
      .from("Registros")
      .select("*")
      .eq("id", user.id)
      .order("created_at", { ascending: false });

    return { data: data as Product[] | [], error };
  }


  // =========================== UPDATE ==========================
  // Actualizar un producto (con reemplazo opcional de imagen)
  async updateProduct(product: Product & { imagen_file?: File }) {
    let publicImageUrl = product.imagen_url;

    // 1. Si el usuario seleccionó un archivo nuevo
    if (product.imagen_file) {
      const fileExt = product.imagen_file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await this.storageRepository.uploadFile(
        'ImagenProductos',
        fileName,
        product.imagen_file
      );

      if (!uploadError && uploadData) {
        if (product.imagen_url) {
          const oldFileName = product.imagen_url.split('/').pop();
          if (oldFileName) await this.storageRepository.removeImage('ImagenProductos', oldFileName);
        }
        publicImageUrl = uploadData.publicUrl;
      }
    }

    // 2. Actualizamos el registro
    const { data, error } = await supabase
      .from("Registros")
      .update({
        titulo: product.titulo,
        resena: product.resena,
        imagen_url: publicImageUrl,
        tipo: product.tipo,
        genero: product.genero,
        autor: product.autor,
        fecha_fin: product.fecha_fin,
        puntuacion: product.puntuacion
      })
      .eq("id_registro", product.id_registro)
      .select();

    return { data, error };
  }


  // =========================== DELETE ==========================
  // Eliminar un producto por ID
  async deleteProduct(id: number): Promise<{ data: any; error: any }> {

    const { data, error } = await supabase
      .from("Registros")
      .delete()
      .eq("id_registro", id);

    if (error) return { data: null, error };

    return { data, error };
  }


  // ============================ ADMIN ==========================
  // Obtener todos los productos sin filtrar por usuario
  async fetchAllProducts() {
    const { data, error } = await supabase
      .from("Registros")
      .select("*")
      .order("created_at", { ascending: false });

    return { data: data as Product[] | [], error };
  }
}