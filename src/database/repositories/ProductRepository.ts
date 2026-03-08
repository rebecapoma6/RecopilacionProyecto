import type { Product } from "../../interfaces/Products";

export interface ProductRepository {

  createProduct(data: Partial<Product>): Promise<{ data?: Product, error?: any }>;

  readProduct(): Promise<{data: Product[], error?: any }>;

  deleteProduct(id: number): Promise<{ data: any; error: any }>;

  updateProduct(product: Product): Promise<{ data: Product[] | null; error: any }>;

  // Función para el Admin
  fetchAllProducts(): Promise<{data: Product[], error?: any }>;
}