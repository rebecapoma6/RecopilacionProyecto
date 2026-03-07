//import { SupabaseUserRepository } from "../supabase/SupabaseUserRepository";
import { SupabaseProductRepository } from "../supabase/SupabaseProductRepository";
import { SupabaseStorageRepository} from "../supabase/SupabaseStorageRepository";
import { SupabaseUserRepository } from "../supabase/SupabaseUserRepository";
import type { ProductRepository } from "./ProductRepository";
import type { StorageRepository } from "./StorageRepository";
import type { UserRepository } from "./UserRepository";


/**
 * Fábrica de repositorios
 *
 * Estas funciones crean una instancia de un repositorio concreto que se utilizará
 * en la aplicación para gestionar las llamadas a sus tablas.
 * 
 * El objetivo de este patrón es abstraer la implementación real (en este caso,
 * Supabase) del resto del código, de modo que si en el futuro se cambia la
 * fuente de datos (por ejemplo, a una API REST o a otro proveedor),
 * no sea necesario modificar el resto de la aplicación.
 */


export const createUserRepository = (): UserRepository => {
  return new SupabaseUserRepository();
};

export const createProductRepository = (): ProductRepository => {
  return new SupabaseProductRepository();
};

export const createStorageRepository = () : StorageRepository =>{
    return new SupabaseStorageRepository();
}