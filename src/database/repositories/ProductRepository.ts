import type { Product } from "../../interfaces/Products";

export interface ProductRepository {
 // -----------------------------
  // CREATE
  // -----------------------------
  createProduct(data: Partial<Product>): Promise<{ data?: Product, error?: any }>;

  // -----------------------------
  // READ
  // -----------------------------
  readProduct(): Promise<{ data: Product[], error?: any }>;

  // -----------------------------
  // UPDATE
  // -----------------------------
  updateProduct(product: Product): Promise<{ data: Product[] | null; error: any }>;

  // -----------------------------
  // DELETE
  // -----------------------------
  deleteProduct(id: number): Promise<{ data: any; error: any }>;

  // -----------------------------
  // METODO DEL ADMIN
  // -----------------------------
  fetchAllProducts(): Promise<{ data: Product[], error?: any }>;
}