import { useNavigate } from "react-router-dom";
import Button from "../components/form/Button";
import { SupabaseProductRepository } from "../database/supabase/SupabaseProductRepository";
import type { Product } from "../interfaces/Products";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import InputField from "../components/form/InputField";

export default function ProductosSupabase() {
  const navigate = useNavigate();
  const repository = new SupabaseProductRepository();

  const [productos, setProductos] = useState<Product[]>([]);

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [criterioFiltro, setCriterioFiltro] = useState("todos");

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

  const productosFiltrados = useMemo(() => {
    if (!terminoBusqueda.trim()) return productos;

    const busquedaMinuscula = terminoBusqueda.toLowerCase();

    return productos.filter((producto) => {
      const titulo = producto.titulo?.toLowerCase() || "";
      const tipo = producto.tipo?.toLowerCase() || "";
      const resena = producto.resena?.toLowerCase() || "";
      const autor = producto.autor?.toLowerCase() || "";

      if (criterioFiltro === "titulo") {
        return titulo.includes(busquedaMinuscula)
      }

      if (criterioFiltro === "tipo") {
        return tipo.includes(busquedaMinuscula)
      }

      if (criterioFiltro === "autor") {
        return autor.includes(busquedaMinuscula);
      }

      return (
        titulo.includes(busquedaMinuscula) ||
        tipo.includes(busquedaMinuscula) ||
        resena.includes(busquedaMinuscula)
      );
    });
  }, [productos, terminoBusqueda, criterioFiltro]);


  return (
    <>
      <div className="bg-primary-400 p-4 min-h-screen flex flex-col">
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-2/3">
            <InputField 
              label="Buscar en la colección"
              id="busqueda"
              name="busqueda"
              type="text"
              placeholder="Escribe para buscar..."
              value={terminoBusqueda} 
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-1/3 flex flex-col">
            <label htmlFor="filtro" className="block mb-1 text-gray-700">Filtrar por</label>
            <select 
              id="filtro"
              className="block w-full border rounded p-2 bg-white"
              value={criterioFiltro}
              onChange={(e) => setCriterioFiltro(e.target.value)}
            >
              <option value="todos">Cualquier campo</option>
              <option value="titulo">Solo Título</option>
              <option value="autor">Solo Autor</option>
              <option value="tipo">Solo Tipo(Libro/Juego)</option>
            </select>
          </div>
        </div>

        <h2 className="text-primary-50 text-2xl font-bold">Mi Colección</h2>
        <p className="text-primary-700 mb-6">Gestiona tus libros y videojuegos favoritos</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          {productosFiltrados.length === 0 && terminoBusqueda !== "" && (
            <p className="text-white col-span-full text-center py-8">
              No se encontraron productos con esos criterios.
            </p>
          )}

          {productos.length === 0 && (
             <p className="text-white col-span-full">No hay productos aún en tu colección.</p>
          )}

          {productosFiltrados.map((producto) => (
            <ProductCard 
              key={producto.id_registro} 
              product={producto} 
              onDelete={(id) => setProductos(productos.filter(p => p.id_registro !== id))}
            />
          ))}

        </div> 
        
        <div className="mt-4 flex justify-center sm:justify-start">
          <Button
            type="button"
            onClick={() => navigate("/agregar-items")}
            className="bg-primary-700 hover:bg-primary-600 text-white py-3 px-8 rounded-md shadow-md"
          >
            + Añadir Nuevo Ítem
          </Button>
        </div>

      </div>
    </>
  )
}