import Button from '../form/Button';
import type { Product } from '../../interfaces/Products';
import { SupabaseProductRepository } from '../../database/supabase/SupabaseProductRepository';
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const repository = new SupabaseProductRepository();
  const navigate = useNavigate();

  const handleUpdate = async () => {
    navigate("/agregar-items", { state: { product } });
  };

  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar "${product.titulo}"?`);
    if (confirmar) {
      const { error } = await repository.deleteProduct(product.id_registro);
      if (error) {
        alert("Error al eliminar de la base de datos");
        console.error(error);
      } else if (onDelete) {
        onDelete(product.id_registro);
      }
    }
  };

  return (
    <div className="app-surface-strong rounded-3xl border p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      {product.imagen_url && (
        <img src={product.imagen_url} alt={product.titulo ?? "Imagen"} className="mb-4 h-44 w-full rounded-2xl object-cover" />
      )}
      <h2 className="mb-2 text-xl font-bold">{product.titulo}</h2>
      <p className="app-muted mb-2">Reseña: {product.resena}</p>
      <p className="app-muted mb-2 text-sm">Tipo: {product.tipo}</p>
      <p className="app-muted mb-2 text-sm">Autor: {product.autor}</p>
      <p className="app-muted mb-4 text-sm">Fecha finalización: {product.fecha_fin ? new Date(product.fecha_fin).toLocaleDateString() : 'N/A'}</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleDelete} className="w-full bg-red-500 text-white hover:bg-red-600">Eliminar</Button>
        <Button onClick={handleUpdate} className="w-full bg-blue-500 text-white hover:bg-blue-600">Modificar</Button>
      </div>
    </div>
  );
}
