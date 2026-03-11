import { useNavigate } from "react-router-dom";
import Button from "../components/form/Button";
import { SupabaseProductRepository } from "../database/supabase/SupabaseProductRepository";
import type { Product } from "../interfaces/Products";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import InputField from "../components/form/InputField";

export default function ProductosSupabase() {
  const navigate = useNavigate();
  const repository = useMemo(() => new SupabaseProductRepository(), []);

  const [productos, setProductos] = useState<Product[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [criterioFiltro, setCriterioFiltro] = useState("todos");

  useEffect(() => {
    let isMounted = true;

    const obtenerProductos = async () => {
      const { data, error } = await repository.readProduct();
      if (error) {
        console.error("Error al obtener productos:", error);
        return;
      }

      if (isMounted) {
        setProductos(data || []);
      }
    };

    void obtenerProductos();

    return () => {
      isMounted = false;
    };
  }, [repository]);

  const productosFiltrados = useMemo(() => {
    if (!terminoBusqueda.trim()) return productos;

    const busquedaMinuscula = terminoBusqueda.toLowerCase();

    return productos.filter((producto) => {
      const titulo = producto.titulo?.toLowerCase() || "";
      const tipo = producto.tipo?.toLowerCase() || "";
      const resena = producto.resena?.toLowerCase() || "";
      const autor = producto.autor?.toLowerCase() || "";

      if (criterioFiltro === "titulo") return titulo.includes(busquedaMinuscula);
      if (criterioFiltro === "tipo") return tipo.includes(busquedaMinuscula);
      if (criterioFiltro === "autor") return autor.includes(busquedaMinuscula);

      return titulo.includes(busquedaMinuscula) || tipo.includes(busquedaMinuscula) || resena.includes(busquedaMinuscula);
    });
  }, [productos, terminoBusqueda, criterioFiltro]);

  return (
    <div className="app-surface mx-auto flex min-h-full w-full max-w-7xl flex-col rounded-[2rem] border p-4 shadow-sm md:p-6">
      <div className="app-surface-strong mb-6 flex flex-col gap-4 rounded-3xl border p-4 shadow-sm sm:flex-row sm:items-end">
        <div className="w-full sm:w-2/3">
          <InputField label="Buscar en la colección" id="busqueda" name="busqueda" type="text" placeholder="Escribe para buscar..." value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)} />
        </div>

        <div className="flex w-full flex-col sm:w-1/3">
          <label htmlFor="filtro" className="app-muted mb-1 block text-sm font-medium">Filtrar por</label>
          <select id="filtro" className="app-input block w-full rounded-xl border p-3" value={criterioFiltro} onChange={(e) => setCriterioFiltro(e.target.value)}>
            <option value="todos">Cualquier campo</option>
            <option value="titulo">Solo título</option>
            <option value="autor">Solo autor</option>
            <option value="tipo">Solo tipo</option>
          </select>
        </div>
      </div>

      <h2 className="text-3xl font-bold">Mi colección</h2>
      <p className="app-muted mb-6">Gestiona tus libros y videojuegos favoritos.</p>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productosFiltrados.length === 0 && terminoBusqueda !== "" && <p className="app-surface-strong col-span-full rounded-2xl border py-8 text-center">No se encontraron productos con esos criterios.</p>}
        {productos.length === 0 && <p className="app-surface-strong col-span-full rounded-2xl border py-8 text-center">No hay productos aún en tu colección.</p>}

        {productosFiltrados.map((producto) => (
          <ProductCard key={producto.id_registro} product={producto} onDelete={(id) => setProductos(productos.filter((p) => p.id_registro !== id))} />
        ))}
      </div>

      <div className="mt-auto flex justify-center sm:justify-start">
        <Button type="button" onClick={() => navigate("/agregar-items")} className="px-8 py-3">+ Añadir nuevo ítem</Button>
      </div>
    </div>
  );
}
