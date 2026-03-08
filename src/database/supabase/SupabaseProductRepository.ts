import type { Product } from "../../interfaces/Products";
import type { ProductRepository } from "../repositories/ProductRepository";
import { supabase } from "./Client";
import { SupabaseStorageRepository } from "./SupabaseStorageRepository";



export class SupabaseProductRepository implements ProductRepository {
  
  // Instanciamos el repositorio de storage para reutilizar la lógica de subida
  //storageRepository = createStorageRepository();
  storageRepository = new SupabaseStorageRepository();

  
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
        // Generamos un nombre único: "productos/UUID.extension"
        uploadedFilePath = `${crypto.randomUUID()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await this.storageRepository.uploadFile(
          'ImagenProductos', // Tu bucket
          uploadedFilePath,
          data.imagen_file
        );

        if (uploadError) {
          return { error: uploadError };
        }

        publicImageUrl = uploadData?.publicUrl ?? null;
      }

      // 2. Insertamos el registro en la tabla "Registros" con la URL obtenida
      const { data: productData, error: insertError } = await supabase
        .from("Registros")
        .insert({
          id: user.id,
          titulo: data.titulo,
          resena: data.resena,
          imagen_url: publicImageUrl, // Guardamos la URL pública
          tipo: data.tipo,
          genero: data.genero,
          autor: data.autor,
          fecha_fin: data.fecha_fin,
          puntuacion: data.puntuacion
          // El ID_REGISTRO suele ser autoincremental, no hace falta pasarlo si es nuevo
        })
        .select()
        .single();

      // 3. Rollback: Si falla la inserción en la tabla, borramos la imagen que acabamos de subir
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

  async readProduct(){
    // 1. Obtenemos el usuario que tiene la sesión activa
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Si no hay usuario, devolvemos lista vacía (o error)
    if (!user) return { data: [], error: new Error("No autenticado") };

    const { data, error } = await supabase
    .from("Registros")
    .select("*")
    .eq("id", user.id)
    .order("created_at", {ascending:false});

    return { data: data as Product[] | [], error};
  }

  async deleteProduct(id: number): Promise<{ data: any; error: any }>{

    // 2. Borramos el registro de la base de datos
    const { data, error } = await supabase
      .from("Registros")
      .delete()
      .eq("id_registro", id);

    if (error) return { data: null, error };

    return { data, error };
  }

async updateProduct(product: Product & { imagen_file?: File }) {
  let publicImageUrl = product.imagen_url;

  // 1. Si el usuario seleccionó un archivo nuevo
  if (product.imagen_file) {
    const fileExt = product.imagen_file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Subimos la nueva imagen
    const { data: uploadData, error: uploadError } = await this.storageRepository.uploadFile(
      'ImagenProductos',
      fileName,
      product.imagen_file
    );

    if (!uploadError && uploadData) {
      // Borramos la imagen antigua si existía
      if (product.imagen_url) {
        const oldFileName = product.imagen_url.split('/').pop();
        if (oldFileName) await this.storageRepository.removeImage('ImagenProductos', oldFileName);
      }
      publicImageUrl = uploadData.publicUrl;
    }
  }

  // 2. Actualizamos con la URL correcta (la nueva o la que ya había)
  const { data, error } = await supabase
    .from("Registros")
    .update({
      titulo: product.titulo,
      resena: product.resena,
      imagen_url: publicImageUrl, // ¡Aquí usamos la variable procesada!
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
}