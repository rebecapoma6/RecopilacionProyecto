import Button from '../form/Button';
import type { Product } from '../../interfaces/Products';
import { SupabaseProductRepository } from '../../database/supabase/SupabaseProductRepository';
import { useNavigate } from "react-router-dom";
interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void; // Función para avisar al padre que borre de la lista
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const repository = new SupabaseProductRepository();
const navigate = useNavigate();
  const handleUpdate = async () =>{
    navigate("/agregar-items", { state: { product } });

  }
  const handleDelete = async () => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar "${product.titulo}"?`);
    
    if (confirmar) {
      const { error } = await repository.deleteProduct(product.id_registro);

      if (error) {
        alert("Error al eliminar de la base de datos ❌");
        console.error(error);
      } else {
        alert("Eliminado correctamente ✅");
        
        if (onDelete) {
          onDelete(product.id_registro);
        } else {
          window.location.reload();
        }
      }
    }
  };
console.log("URL de la imagen:", product.imagen_url);
  return (
    <div className="border rounded-lg p-6 shadow-md hover:shadow-lg transition bg-white">
      {product.imagen_url && (
     <img
  src={product.imagen_url} // Ya tiene la ruta completa, no le añadas nada más
  alt={product.titulo ?? "Imagen"}
  className="h-40 object-cover mb-4 rounded"
/>
      )}
      <h2 className="text-xl font-bold mb-2">{product.titulo}</h2>
      <p className="text-gray-600 mb-2">Reseña: {product.resena}</p>
      <p className="text-sm text-gray-500 mb-4">Tipo: {product.tipo}</p>
      <p className="text-sm text-gray-500 mb-4">Autor: {product.autor}</p>
      <p className="text-sm text-gray-500 mb-4">Fecha Finalización: {product.fecha_fin ? new Date(product.fecha_fin).toLocaleDateString() : 'N/A'}</p>


      
      <div className="flex gap-2">
        <Button 
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Eliminar
        </Button>
        
        <Button 
        onClick={handleUpdate}
        className="bg-blue-500 hover:bg-blue-600 text-white">
          Modificar
        </Button>
      </div>
    </div>
  );
}