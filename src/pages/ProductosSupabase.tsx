import { useNavigate } from "react-router-dom";
import Button from "../components/form/Button";
import { SupabaseProductRepository } from "../database/supabase/SupabaseProductRepository";
import type { Product } from "../interfaces/Products";
import { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard";

export default function ProductosSupabase(){
const navigate = useNavigate();
  const repository = new SupabaseProductRepository();

  const [productos, setProductos] = useState<Product[]>([]);

    const obtenerProductos = async () => {
    const { data, error } = await repository.readProduct();
    if (error) {
      console.error("Error al obtener productos:", error);
    } else {
      setProductos(data || []);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);
    return(
        
    <>
      <div className="bg-primary-400 p-4">
        <h2 className="text-primary-50 text-xl font-bold">Mi Colección</h2>
        <p className="text-primary-700 mb-4">Gestiona tus libros y videojuegos favoritos</p>
        <Button
          type="button"
          onClick={() => navigate("/agregar-items")}
          className="bg-primary-700 hover:bg-primary-600 text-white py-2 rounded-md mb-4"
        >
          Añadir Ítem
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.length === 0 && <p className="text-white">No hay productos aún.</p>}
          
          {productos.map((producto) => (
            <ProductCard 
              key={producto.id_registro} 
              product={producto} 
              onDelete={(id) => setProductos(productos.filter(p => p.id_registro !== id))}
            />
          ))}
        </div>
      </div>
        </>
        
    )
}